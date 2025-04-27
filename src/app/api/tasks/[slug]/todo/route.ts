import { connectDB } from "@config/db";
import { protectRoute } from "@middlewares/authMiddleware";
import TaskModel from "@models/Task";
import { TypeTodo } from "@utils/types";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// @desc Update task checklist
// @route PUT /api/tasks/:id/todo
// @access Private

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const taskId = req.url.split("/")[5].split("?")[0];

    const { todoChecklist } = await req.json();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const task = await TaskModel.findById(taskId);
    if(!task) return NextResponse.json({ message:"Task not found" }, { status:404 });

    const isAssigned = task.assignedTo.some((userId:ObjectId) => userId.toString() === userToken._id.toString());
    if(!isAssigned && userToken.role !== "admin") return NextResponse.json({ message:"Not authorized to update checklist" }, { status:403 });

    task.todoChecklist = todoChecklist || task.todoChecklist;

//! Update progress
    const totalCount = task.todoChecklist.length;
    const completedCount = task.todoChecklist.filter((item:TypeTodo) => item.completed).length;
    task.progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

//! Update status
    if(task.progress <= 0) task.status = "Pendiente";
    if(task.progress > 0) task.status = "En curso";
    if(task.progress === 100) task.status = "Finalizada";

    await task.save();
    const updatedTask = await TaskModel.findById(taskId).populate("assignedTo", "name email profileImageUrl");

    return NextResponse.json({ message:"Task checklist updated successfully", updatedTask }, { status:201 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};