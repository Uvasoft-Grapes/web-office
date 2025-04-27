import { connectDB } from "@config/db";
import { adminOnly } from "@middlewares/authMiddleware";
import TaskModel from "@models/Task";
import UserModel from "@models/User";
import { NextRequest, NextResponse } from "next/server";

// @desc Get all users
// @route GET /api/users
// @access Private (Admin only)

export async function GET(req:NextRequest) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const users = await UserModel.find().select("-password");

    const usersWithTaskCounts = await Promise.all(users.map( async (user) => {
      const pendingTasks = await TaskModel.countDocuments({ assignedTo:user._id, status:"Pendiente" });
      const inProgressTasks = await TaskModel.countDocuments({ assignedTo:user._id, status:"En curso" });
      const completedTasks = await TaskModel.countDocuments({ assignedTo:user._id, status:"Finalizada" });

      return { ...user._doc, pendingTasks, inProgressTasks, completedTasks };
    }));

    return NextResponse.json(usersWithTaskCounts, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};