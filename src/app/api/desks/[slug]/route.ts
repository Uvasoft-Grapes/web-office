import { NextRequest, NextResponse } from "next/server";
import Mongoose from "mongoose";
import { parse, serialize } from "cookie";
import { connectDB } from "@config/db";
import { generateAuthToken, verifyDeskToken, verifyOwnerToken, verifyUserToken } from "@middlewares/authMiddleware";
import FolderModel from "@models/Folder";
import DeskModel from "@models/Desk";
import TaskModel from "@models/Task";
import AccountModel from "@models/Account";
import TransactionModel from "@models/Transaction";
import { TypeDesk, TypeUser } from "@utils/types";

const { NODE_ENV } =  process.env;

// @desc Get desk by ID
// @route GET /api/desks/:id
// @access Owner, members

export async function GET(req:Request) {
  try {
    await connectDB();
    const deskId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Find desk
    const findDesk:TypeDesk = await DeskModel.findById(deskId).populate("members", "name email profileImageUrl role");
    if(!findDesk) return NextResponse.json({ message:"Desk not found" }, { status:404 });
    if(userToken.role !== "owner" && !findDesk.members.find((user:TypeUser) => user._id.toString() === userToken._id.toString())) return NextResponse.json({ message:"Acceso denegado" }, { status:403 }); 

//! Save desk token
    const newDeskToken = generateAuthToken(deskId);
    if(!newDeskToken) return NextResponse.json({ message:"Error creating desk token" }, { status:404 });

    const serializedAuthCookie = serialize('deskToken', newDeskToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });

    const res = NextResponse.json({ message:"Escritorio activo", desk:findDesk }, { status:200 });
    res.headers.set('Set-Cookie', serializedAuthCookie);

    return res;
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Update desk
// @route PUT /api/desks/:id
// @access Owner

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const deskId = req.url.split("/")[5].split("?")[0];
    const { title, members } = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate Admin token
    const userToken:TypeUser|NextResponse = await verifyOwnerToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id, userToken.role);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

    if(deskId !== desk._id.toString()) return NextResponse.json({ message:"Wrong desk" }, { status:500 });

//! Validations
    if(!title.trim()) return NextResponse.json({ message:"El título debe tener al menos 1 carácter." }, { status:400 });
    if(title.trim().length > 200) return NextResponse.json({ message:"El título puede tener un máximo de 200 caracteres." }, { status:400 });
    if(members.length < 1) return NextResponse.json({ message:"El escritorio debe tener por lo menos un miembro." }, { status:400 });

//! Update desk
    const updatedDesk = await DeskModel.findByIdAndUpdate(desk._id, { title, members }, { new:true }).populate("members", "name email profileImageUrl role");
    if(!updatedDesk) return NextResponse.json({ message:"Error updating desk" }, { status:500 });

    return NextResponse.json({ message:"Escritorio actualizado", desk:updatedDesk }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete desk
// @route DELETE /api/desks/:id
// @access Owner

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const deskId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyOwnerToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id, userToken.role);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

    if(deskId !== desk._id.toString()) return NextResponse.json({ message:"Wrong desk" }, { status:500 });

//! Delete desk
    const deletedDesk = await DeskModel.findByIdAndDelete(deskId);
    if(!deletedDesk) return NextResponse.json({ message:"Error deleting desk" }, { status:500 });

//! Delete desk data
    const objectId = new Mongoose.Types.ObjectId(deskId);
  //? Folders
    const deletedFolders = await FolderModel.deleteMany({ desk:objectId });
    if(!deletedFolders.acknowledged) return NextResponse.json({ message:"Error deleting folders" }, { status:500 });
  //? Tasks
    const deletedTasks = await TaskModel.deleteMany({ desk:objectId });
    if(!deletedTasks.acknowledged) return NextResponse.json({ message:"Error deleting tasks" }, { status:500 });
  //? Accounts
    const accounts = await AccountModel.find({ desk:objectId });
    if (accounts.length) {
      const accountIds = accounts.map((account) => account._id);
      const deletedTransactions = await TransactionModel.deleteMany({ account:{ $in:accountIds } });
      if(!deletedTransactions.acknowledged) return NextResponse.json({ message:"Error deleting transactions" }, { status:500 });
      const deletedAccounts = await AccountModel.deleteMany({ desk:objectId });
      if(!deletedAccounts.acknowledged) return NextResponse.json({ message:"Error deleting accounts" }, { status:500 });
    }

    return NextResponse.json({ message:"Escritorio eliminado", desk:deletedDesk }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};