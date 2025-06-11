import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { TypeDesk, TypeUser } from "@utils/types";
import { verifyAdminToken, verifyDeskToken, verifyOwnerToken, verifyUserToken } from "@middlewares/authMiddleware";
import AccountModel from "@models/Account";
import TransactionModel from "@models/Transaction";
import { compareAsc, compareDesc } from "date-fns";

const statusManagement: Record<string, number> = {
  "Pendiente": 1,
  "Finalizado": 2,
  "Cancelado": 3,
};

// @desc Get account by ID
// @route GET /api/accounts/:id
// @access Owner, Assigned

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const accountId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

    const queries = req.url.split("?")[1]?.split("&");
    const queryStatus = queries.find(item => item.includes("status="))?.split("=")[1];
    const queryType = queries.find(item => item.includes("type="))?.split("=")[1];
    const queryCategory = queries.find(item => item.includes("category="))?.split("=")[1];
    const filter = {
      status:queryStatus ? decodeURIComponent(queryStatus).replace("+", " ") : undefined,
      type:queryType ? decodeURIComponent(queryType).replace("+", " ") : undefined,
      category:queryCategory ? decodeURIComponent(queryCategory).replace("+", " ") : undefined,
    };
console.log(filter)
    const querySort = queries.find(item => item.includes("sort="))?.split("=")[1];
    const sort =  querySort ? decodeURIComponent(querySort).replace(/\+/g, " ") : "Fecha (desc)";

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

    const account = await AccountModel.findById(accountId).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!account) return NextResponse.json({ message:"Task not found" }, { status:404 });
    if(userToken.role !== "owner" && !account.assignedTo.find((user:TypeUser) => user._id.toString() === userToken._id.toString())) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

    let transactions = await TransactionModel.find({ account:accountId }).populate("createdBy", "name email profileImageUrl").populate("category");
    if(!transactions) return NextResponse.json({ message:"Task not found" }, { status:404 });

//! Filter transactions
    if(filter.status) transactions = transactions.filter(transaction => transaction.status === filter.status);
    if(filter.type) transactions = transactions.filter(transaction => transaction.type === filter.type);
    if(filter.category) transactions = transactions.filter(transaction => transaction.category._id.toString() === filter.category);

//! Sort transactions
    if(sort === "Fecha (desc)") transactions = transactions.sort((a, b) => compareDesc(a.date, b.date));
    if(sort === "Fecha (asc)") transactions = transactions.sort((a, b) => compareAsc(a.date, b.date));
    if(sort === "Estado (asc)") transactions = transactions.sort((a, b) => statusManagement[b.status] - statusManagement[a.status]);
    if(sort === "Estado (desc)") transactions = transactions.sort((a, b) => statusManagement[a.status] - statusManagement[b.status]);
    if(sort === "Título (asc)") transactions = transactions.sort((a, b) => a.title.localeCompare(b.title));
    if(sort === "Título (desc)") transactions = transactions.sort((a, b) => b.title.localeCompare(a.title));

    return NextResponse.json({ ...account._doc, transactions }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Update account details
// @route PUT /api/accounts/:id
// @access Owner, Admin

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const accountId = req.url.split("/")[5].split("?")[0];
    const { folder, title, assignedTo } = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validations
    if(!title.trim()) return NextResponse.json({ message:"El título debe tener al menos 1 carácter." }, { status:400 });
    if(title.trim().length > 200) return NextResponse.json({ message:"El título puede tener un máximo de 200 caracteres." }, { status:400 });

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyAdminToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Update Task
    const newAccount = await AccountModel.findById(accountId);
    if(!newAccount) return NextResponse.json({ message:"Account not found" }, { status:404 });

    newAccount.folder = folder || newAccount.folder;
    newAccount.title = title || newAccount.title;
    if(assignedTo) {
      if(!Array.isArray(assignedTo)) return NextResponse.json(
        { message:"AssignedTo must be an array of user IDs" },
        { status:400 });
        newAccount.assignedTo = assignedTo;
    };

    await newAccount.save();

//! Populate task
    const account = await AccountModel.findById(accountId).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!account) return NextResponse.json({ message:"Account not found" }, { status:404 });

    return NextResponse.json({ message:"Cuenta actualizada", account }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private Owner

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const accountId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyOwnerToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Delete Task
    const account = await AccountModel.findByIdAndDelete(accountId);
    if(!account) return NextResponse.json({ message:"Account not found" }, { status:404 });

    return NextResponse.json({ message:"Account deleted successfully" }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};