import { connectDB } from "@/src/config/db";
import { adminOnly } from "@/src/middlewares/authMiddleware";
import TaskModel from "@/src/models/Task";
import { NextRequest, NextResponse } from "next/server";
import excelJS from "exceljs";
import { NextApiResponse } from "next";

// @desc Export all tasks as an Excel file
// @route GET /api/reports/tasks
// @access Private (Admin)

export async function GET(req:NextRequest, res:NextApiResponse) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const tasks = await TaskModel.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header:"Tarea ID", key:"_id", width:25 },
      { header:"Título", key:"title", width:30 },
      { header:"Descripción", key:"description", width:50 },
      { header:"Prioridad", key:"priority", width:15 },
      { header:"Estado", key:"status", width:20 },
      { header:"Fecha límite", key:"dueDate", width:20 },
      { header:"Designados", key:"assignedTo", width:30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo.map((user:{ name:string, email:string }) => `${user.name} (${user.email})`).join(", ");
      worksheet.addRow({
        _id:task._id,
        title:task.title,
        description:task.description,
        priority:task.priority,
        status:task.status,
        dueDate:task.dueDate.toISOString().split("T")[0],
        assignedTo:assignedTo || "Sin asignar",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    res.setHeader("Content-Type", "attachment; filename='tasks_report.xlsx'");

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};