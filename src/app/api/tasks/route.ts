import { connectDB } from "@config/db";
import { adminOnly, protectRoute } from "@middlewares/authMiddleware";
import { TypeTodo } from "@utils/types";
import TaskModel from "@models/Task";
import { NextRequest, NextResponse } from "next/server";

export interface TypeStatusSummary {
  allTasks:number;
  pendingTasks:number;
  inProgressTasks:number;
  completedTasks:number;
}

// @desc Get all tasks (Admin: all, User: only assigned tasks)
// @route GET /api/tasks/
// @access Private

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const queries = req.url.split("?")[1]?.split("&");
    const status = queries.find(item => item.includes("status="))?.split("=")[1];
    const filter = { 
      status:status ? decodeURIComponent(status).replace("+", " ") : undefined,
    };

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

//! Get desk id
    const deskId = Object.fromEntries(req.headers.entries()).desk;
    if(!deskId) return NextResponse.json({ message:"Desk id not provided" }, { status:404 });

//! All tasks
    let tasks = [];
    if(userToken.role === "admin") tasks = await TaskModel.find({ desk:deskId }).populate("assignedTo", "name email profileImageUrl");
    if(userToken.role === "user") tasks = await TaskModel.find({ desk:deskId, assignedTo:userToken._id }).populate("assignedTo", "name email profileImageUrl");

//! Filter tasks
    if(filter.status) tasks = tasks.filter(task => task.status === filter.status);

//! Add completed todo checklist count to each task
    tasks = await Promise.all(tasks.map(async (task) => {
      const completedTodoCount = task.todoChecklist.filter((item:TypeTodo) => item.completed).length;
      return { ...task._doc, completedTodoCount };
    }));

//! Status summary counts
    const  allTasks = await TaskModel.countDocuments(userToken.role === "admin" ? { desk:deskId } : { desk:deskId, assignedTo:userToken._id });
    const pendingTasks = await TaskModel.countDocuments({ status:"Pendiente", desk:deskId, ...(userToken.role !== "admin" && { assignedTo: userToken._id }) });
    const inProgressTasks = await TaskModel.countDocuments({ status:"En curso", desk:deskId, ...(userToken.role !== "admin" && { assignedTo: userToken._id }) });
    const completedTasks = await TaskModel.countDocuments({ status:"Finalizada", desk:deskId, ...(userToken.role !== "admin" && { assignedTo: userToken._id }) });
    const statusSummary:TypeStatusSummary = { allTasks, pendingTasks, inProgressTasks, completedTasks };

    return NextResponse.json({ tasks, statusSummary }, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Create a new task (Admin only)
// @route POST /api/tasks/
// @access Private (Admin)

export async function POST(req:NextRequest) {
  try {
    await connectDB();

    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = await req.json();
    if(!Array.isArray(assignedTo)) return NextResponse.json({ message:"AssignedTo must be an array of users IDs" }, { status:400 });

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

//! Get desk id
    const deskId = Object.fromEntries(req.headers.entries()).desk;
    if(!deskId) return NextResponse.json({ message:"Desk id not provided" }, { status:404 });

    const task = await TaskModel.create({
      desk:deskId,
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy:userToken._id,
      attachments,
      todoChecklist
    });
    if(!task) return NextResponse.json({ message:"Create task error"}, { status:500 });

    return NextResponse.json({ message:"Task created successfully", task }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};