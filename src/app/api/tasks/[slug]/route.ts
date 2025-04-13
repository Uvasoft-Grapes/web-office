import { connectDB } from "@/src/config/db";
import { adminOnly, protectRoute } from "@/src/middlewares/authMiddleware";
import TaskModel from "@models/Task";
import { NextRequest, NextResponse } from "next/server";

// @desc Get task by ID
// @route GET /api/tasks/:id
// @access Private

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const taskId = req.url.split("/")[5].split("?")[0];

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const task = await TaskModel.findById(taskId).populate("assignedTo", "name email profileImageUrl");
    if(!task) return NextResponse.json({ message:"Task not found" }, { status:404 });

    return NextResponse.json(task, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Update task details
// @route PUT /api/tasks/:id
// @access Private

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const taskId = req.url.split("/")[5].split("?")[0];
    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = await req.json();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const task = await TaskModel.findById(taskId).populate("assignedTo", "name email profileImageUrl");
    if(!task) return NextResponse.json({ message:"Task not found" }, { status:404 });

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.todoChecklist = todoChecklist || task.todoChecklist;
    task.attachments = attachments || task.attachments;

    if(assignedTo) {
      if(!Array.isArray(assignedTo)) return NextResponse.json({ message:"AssignedTo must be an array of user IDs" }, { status:400 });
      task.assignedTo = assignedTo;
    };

    const updatedTask = await task.save();

    return NextResponse.json({ message:"Task updated successfully", updatedTask }, { status:201 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private (Admin)

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const taskId = req.url.split("/")[5].split("?")[0];

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const task = await TaskModel.findByIdAndDelete(taskId).populate("assignedTo", "name email profileImageUrl");
    if(!task) return NextResponse.json({ message:"Task not found" }, { status:404 });

    return NextResponse.json({ message:"Task deleted successfully" }, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};