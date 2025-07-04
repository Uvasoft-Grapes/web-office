import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyDeskToken, verifyUserToken } from "@middlewares/authMiddleware";
import TransactionModel from "@models/Transaction";
import AccountModel from "@models/Account";
import { TypeAccount, TypeAccountsDashboardData, TypeDesk, TypeUser } from "@utils/types";
import CategoryModel from "@/src/models/Category";

const CURRENT_YEAR = new Date().getFullYear();
const EMPTY:TypeAccountsDashboardData = {
  generalInfo: { totalBalance:0, totalIncome:0, totalExpense:0, totalPending:0 },
  transactionsAnalysis: {
    recentTransactions:[],
    categoryDistribution:[],
  },
  timeAnalysis: {
    monthlyTrends:[],
  },
  insights:{
    transactionsStatuses:{ total:0, pending:0, completed:0, canceled:0 },
    topAccounts:{
      income:[],
      expense:[],
      balance:[],
    },
  },
};

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id, userToken.role);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

    // 🔹 Filtrar cuentas que pertenecen a ese desk
    let accounts:TypeAccount[] = [];
    if(userToken.role === "owner") accounts = await AccountModel.find({ desk:desk._id });
    if(userToken.role === "admin" || userToken.role === "user" || userToken.role === "client") accounts = await AccountModel.find({ desk:desk._id, assignedTo:userToken._id });
    if(!accounts.length) return NextResponse.json({ accounts, dashboard:EMPTY }, { status:200 });

    const accountIds = accounts.map((account) => account._id);

    // 🔹 Información General (Filtrada por las cuentas de ese desk)
    const [incomeResult, expenseResult] = await Promise.all([
      TransactionModel.aggregate([{ $match: { account: { $in: accountIds }, type: "income", status:"Finalizado" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      TransactionModel.aggregate([{ $match: { account: { $in: accountIds }, type: "expense", status:"Finalizado" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    const [incomePending, expensePending] = await Promise.all([
      TransactionModel.aggregate([{ $match: { account: { $in: accountIds }, type: "income", status:"Pendiente" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      TransactionModel.aggregate([{ $match: { account: { $in: accountIds }, type: "expense", status:"Pendiente" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;
    const totalBalance = totalIncome - totalExpense;
    const totalPending = (incomePending[0]?.total || 0) - (expensePending[0]?.total || 0);

    // 🔹 Análisis de Transacciones
    const recentTransactions = await TransactionModel.find({ account:{ $in:accountIds } }).sort({ date:-1 }).limit(10);
    const categoryDistribution:{ label:string, count:number }[] = await TransactionModel.aggregate([
      { $match: { account: { $in: accountIds } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $project: { label: "$_id", count: "$total" } },
    ]);
    categoryDistribution.forEach(async (dis) => {
      const cat = await CategoryModel.findById(dis.label);
      if(!cat) return;
      dis.label = cat.label;
    });

    // 🔹 Análisis Temporal
    const monthlyTrends = await TransactionModel.aggregate([
      { $match: { account: { $in: accountIds } } },
      {
        $group: {
          _id:{ $month:"$date" },
          income:{ 
            $sum: { 
              $cond: [
                { $and: [{ $eq: ["$type", "income"] }, { $eq: ["$status", "Finalizado"] }] },
                "$amount",
                0
              ]
            } 
          },
          expense: { 
            $sum: { 
              $cond: [
                { $and: [{ $eq: ["$type", "expense"] }, { $eq: ["$status", "Finalizado"] }] },
                "$amount",
                0
              ]
            } 
          },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🔹 Insights y Alertas
    const transactionsStatuses = {
      total:await TransactionModel.countDocuments({ account:{ $in:accountIds } }),
      pending:await TransactionModel.countDocuments({ account:{ $in:accountIds }, status:"Pendiente" }),
      completed:await TransactionModel.countDocuments({ account:{ $in:accountIds }, status:"Finalizado" }),
      canceled:await TransactionModel.countDocuments({ account:{ $in:accountIds }, status:"Cancelado" }),
    };
    const topAccounts = {
      income:await TransactionModel.aggregate([
        { $match:{ account:{ $in:accountIds }, type:"income", status:"Finalizado" } },
        { $group:{ _id:"$account", total:{ $sum:"$amount" } } },
        { $sort:{ total:-1 } },
        { $limit:3 },
      ]),
      expense:await TransactionModel.aggregate([
        { $match:{ account:{ $in:accountIds }, type:"expense", status:"Finalizado" } },
        { $group:{ _id:"$account", total:{ $sum:"$amount" } } },
        { $sort:{ total:-1 } },
        { $limit:3 },
      ]),
      balance:await AccountModel.aggregate([
        { $match:{ desk:desk._id, } },
        { $group:{ _id:"$_id", total:{ $sum:"$balance" } } },
        { $sort:{ total:-1 } },
        { $limit:3 },
      ]),
    };

    // 🔹 Estructurar respuesta
    const data:TypeAccountsDashboardData = {
      generalInfo: { totalBalance, totalIncome, totalExpense, totalPending },
      transactionsAnalysis: {
        recentTransactions,
        categoryDistribution,
      },
      timeAnalysis: {
        monthlyTrends:monthlyTrends.map(({ _id, income, expense, transactions }) => ({
          month: new Date(CURRENT_YEAR, _id - 1, 1).toLocaleString("es", { month: "long" }),
          income,
          expense,
          transactions,
        })),
      },
      insights:{
        transactionsStatuses,
        topAccounts:{
          income:topAccounts.income.map(({ _id, total }) => ({ _id, total })),
          expense:topAccounts.expense.map(({ _id, total }) => ({ _id, total })),
          balance:topAccounts.balance.map(({ _id, total }) => ({ _id, total })),
        },
      },
    };

    return NextResponse.json({ accounts, dashboard:data }, { status:200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ message:"Internal Server Error" }, { status:500 });
  };
};