import { connectDB } from "@/src/config/db";
import { adminOnly } from "@/src/middlewares/authMiddleware";
import TaskModel from "@/src/models/Task";
import { NextRequest, NextResponse } from "next/server";
import excelJS from "exceljs";
import { NextApiResponse } from "next";
import UserModel from "@/src/models/User";

// @desc Export user tasks as an Excel file
// @route GET /api/reports/tasks/:id
// @access Private (Admin)

interface TypeMap {
  [id:string]:{
    name:string;
    email:string;
    taskCount:number;
    pendingTasks:number;
    inProgressTasks:number;
    completedTasks:number;
  }
} 

export async function GET(req:NextRequest, res:NextApiResponse) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const users = await UserModel.find().select("name email"); // .lean()

    const userTasks = await TaskModel.find().populate("assignedTo", "name email");

    const userTaskMap:TypeMap = {};

    users.forEach((user) => {
      userTaskMap[user._id.toString()] = {
        name:user.name,
        email:user.email,
        taskCount:0,
        pendingTasks:0,
        inProgressTasks:0,
        completedTasks:0,
      }
    });

    userTasks.forEach((task) => {
      if(!task.assignedTo) return;
      task.assignedTo.forEach((assignedUser:{ _id:string }) => {
        if(!userTaskMap[assignedUser._id]) return;
        userTaskMap[assignedUser._id].taskCount += 1;
        if(task.status === "Pendiente") userTaskMap[assignedUser._id].pendingTasks += 1;
        if(task.status === "En curso") userTaskMap[assignedUser._id].inProgressTasks += 1;
        if(task.status === "Finalizada") userTaskMap[assignedUser._id].completedTasks += 1;
      });
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header:"Nombre", key:"name", width:30 },
      { header:"Correo", key:"email", width:40 },
      { header:"Tareas", key:"taskCount", width:20 },
      { header:"Pendientes", key:"pendingTasks", width:20 },
      { header:"En curso", key:"inProgressTasks", width:20 },
      { header:"Finalizadas", key:"completedTasks", width:20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    res.setHeader("Content-Type", "attachment; filename='users_task_report.xlsx'");

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};