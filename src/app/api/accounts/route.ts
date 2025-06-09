import { NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyUserToken } from "@middlewares/authMiddleware";
import AccountModel from "@models/Account";
import TransactionModel from "@models/Transaction";
import { TypeDesk, TypeUser } from "@utils/types";
import { ROLES_DATA } from "@utils/data";

// const statusManagement: Record<string, number> = {
//   "Pendiente": 1,
//   "Finalizado": 2,
//   "Cancelado":3
// };

// const typeManagement: Record<string, number> = {
//   "income": 1,
//   "expense": 2,
// };

// @desc Get all accounts
// @route GET /api/accounts
// @access Owner:all, Admin|User|client:only assigned accounts

export async function GET(req:Request) {
  try {
    await connectDB();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

    const queries = req.url.split("?")[1]?.split("&");
    const queryFolder = queries.find(item => item.includes("folder="))?.split("=")[1];
    const filter = {
      folder:queryFolder ? decodeURIComponent(queryFolder).replace("+", " ") : undefined,
    };

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! All accounts
    let accounts = [];
    if(userToken.role === "owner") accounts = await AccountModel.find({ desk:desk._id }).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(ROLES_DATA.find((role) => role.value === userToken.role)) accounts = await AccountModel.find({ desk:desk._id, assignedTo:userToken._id }).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");

//! Filter accounts
    if(filter.folder) accounts = accounts.filter(account => account.folder._id.toString() === filter.folder);

//! Status summary counts
    accounts = await Promise.all(accounts.map(async (account) => {
      const statusSummary = {
        pending:await TransactionModel.countDocuments({ status:"Pendiente", account:account._id }),
        completed:await TransactionModel.countDocuments({ status:"Finalizado", account:account._id }),
        canceled:await TransactionModel.countDocuments({ status:"Cancelado", account:account._id }),
      }
      return { ...account._doc, statusSummary };
    }));

    return NextResponse.json(accounts, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Create a new account
// @route POST /api/accounts
// @access Owner, Admin

export async function POST(req:Request) {
  try {
    await connectDB();
    const { folder, title, assignedTo } = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyAdminToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Validations
    if(!Array.isArray(assignedTo)) return NextResponse.json({ message:"AssignedTo must be an array of users IDs" }, { status:400 });

    const newAccount = await AccountModel.create({
      desk:desk._id,
      folder,
      title,
      assignedTo,
    });
    if(!newAccount) return NextResponse.json({ message:"Create account error"}, { status:500 });

    const account = await AccountModel.findById(newAccount._id).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!account) return NextResponse.json({ message:"Account not found"}, { status:404 });

    return NextResponse.json({ message:"Cuenta creada", account }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};