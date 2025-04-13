import { connectDB } from "@/src/config/db";
import { adminOnly } from "@/src/middlewares/authMiddleware";
import TaskModel from "@/src/models/Task";
import { NextRequest, NextResponse } from "next/server";

// @desc Dashboard Data (Admin only)
// @route GET /api/tasks/dashboard-data
// @access Private (Admin)

export async function GET(req:NextRequest) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

//! Fetch statistics
    const totalTasks = await TaskModel.countDocuments();
    const pendingTasks = await TaskModel.countDocuments({ status:"Pendiente" });
    const inProgressTasks = await TaskModel.countDocuments({ status:"En curso" });
    const completedTasks = await TaskModel.countDocuments({ status:"Finalizada" });
    const overdueTasks = await TaskModel.countDocuments({
      status:{ $ne:"Finalizada" },
      dueDate:{ $lt: new Date() },
    });

//! Ensure all possible statuses are included
    const taskStatuses = ["Pendiente", "En curso", "Finalizada"];
    const taskDistributionRaw = await TaskModel.aggregate([
      {
        $group:{
          _id:"$status",
          count:{ $sum:1 },
        }
      }
    ]);
    const taskDistribution = taskStatuses.reduce<Record<string, number>>((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for response keys
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {} as Record<string, number>);
    taskDistribution["All"] = totalTasks; // Add total count to taskDistribution

//! Ensure all priority levels are included
    const taskPriorities = ["Baja", "Media", "Alta"];
    const taskPriorityLevelsRaw = await TaskModel.aggregate([
      {
        $group:{
          _id:"$priority",
          count:{ $sum:1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce<Record<string, number>>((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {} as Record<string, number>);

//! Fetch recent 10 tasks
    const recentTasks = await TaskModel.find().sort({ createdAt:-1 }).limit(10).select("title status priority dueDate createdAt");

    return NextResponse.json({ 
      statistics:{
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      },
      charts:{
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    }, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};