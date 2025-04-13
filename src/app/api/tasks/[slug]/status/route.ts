import { connectDB } from "@/src/config/db";
import { protectRoute } from "@/src/middlewares/authMiddleware";
import TaskModel from "@/src/models/Task";
import { TypeTodo } from "@/src/utils/types";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// @desc Update task status
// @route PUT /api/tasks/:id/status
// @access Private

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const taskId = req.url.split("/")[5].split("?")[0];

    const { status } = await req.json();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const task = await TaskModel.findById(taskId);
    if(!task) return NextResponse.json({ message:"Task not found" }, { status:404 });

    const isAssigned = task.assignedTo.some((userId:ObjectId) => userId.toString() === userToken._id.toString());
    if(!isAssigned && userToken.role !== "admin") return NextResponse.json({ message:"Not authorized to update status" }, { status:403 });

    task.status = status || task.status;
    if(task.status === "Finalizada") {
      task.todoChecklist.forEach((item:TypeTodo) => item.completed = true);
      task.progress = 100;
    }

    const updatedTask = await task.save();

    return NextResponse.json({ message:"Task status updated", updatedTask }, { status:201 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};