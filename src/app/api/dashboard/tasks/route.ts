import { connectDB } from "@config/db";
import { protectRoute } from "@middlewares/authMiddleware";
import TaskModel from "@models/Task";
import { TypeUser } from "@utils/types";
import Mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface TaskAggregationResult {
  _id: string; // Represents the status or priority of the task
  count: number; // Number of tasks with this status or priority
};

const getDashboardData = async (user:TypeUser, deskIdString:string) => {
  const deskId = new Mongoose.Types.ObjectId(deskIdString);

  let totalTasks = 0;
  let pendingTasks = 0;
  let inProgressTasks = 0;
  let completedTasks = 0;
  let overdueTasks = 0;

  const taskStatuses = ["Pendiente", "En curso", "Finalizada"];
  let taskDistributionRaw:TaskAggregationResult[];
  const taskPriorities = ["Baja", "Media", "Alta"];
  let taskPriorityLevelsRaw:TaskAggregationResult[];

  let recentTasks;

  if(user.role === "admin") {
//! Fetch admin statistics
    totalTasks = await TaskModel.countDocuments({ desk:deskId });
    pendingTasks = await TaskModel.countDocuments({ desk:deskId, status:"Pendiente" });
    inProgressTasks = await TaskModel.countDocuments({ desk:deskId, status:"En curso" });
    completedTasks = await TaskModel.countDocuments({ desk:deskId, status:"Finalizada" });
    overdueTasks = await TaskModel.countDocuments({
      desk:deskId,
      status:{ $ne:"Finalizada" },
      dueDate:{ $lt: new Date() },
    });
//! Ensure all possible statuses are included
    taskDistributionRaw = await TaskModel.aggregate([
      {
        $match:{  desk:deskId },
      },
      {
        $group:{
          _id:"$status",
          count:{ $sum:1 },
        }
      }
    ]);

//! Ensure all priority levels are included
    taskPriorityLevelsRaw = await TaskModel.aggregate([
      {
        $match:{  desk:deskId },
      },
      {
        $group:{
          _id:"$priority",
          count:{ $sum:1 },
        },
      },
    ]);

//! Fetch recent 10 tasks
    recentTasks = await TaskModel.find({ desk:deskId }).sort({ createdAt:-1 }).limit(10).select("title status priority dueDate createdAt");

  } else if(user.role === "user") {
//! Fetch statistics for user-specific tasks
    totalTasks = await TaskModel.countDocuments({ desk:deskId, assignedTo:user._id });
    pendingTasks = await TaskModel.countDocuments({ desk:deskId, assignedTo:user._id, status:"Pendiente" });
    inProgressTasks = await TaskModel.countDocuments({ desk:deskId, assignedTo:user._id, status:"En curso" });
    completedTasks = await TaskModel.countDocuments({ desk:deskId, assignedTo:user._id, status:"Finalizada" });
    overdueTasks = await TaskModel.countDocuments({
      desk:deskId,
      assignedTo:user._id,
      status:{ $ne:"Finalizada" },
      dueDate:{ $lt: new Date() },
    });

//! Ensure all possible statuses are included
    taskDistributionRaw = await TaskModel.aggregate([
      {
        $match:{  desk:deskId, assignedTo:user._id },
      },
      {
        $group:{
          _id:"$status",
          count:{ $sum:1 },
        }
      }
    ]);

//! Ensure all priority levels are included
    taskPriorityLevelsRaw = await TaskModel.aggregate([
      {
        $match:{ desk:deskId, assignedTo:user._id },
      },
      {
        $group:{
          _id:"$priority",
          count:{ $sum:1 },
        },
      },
    ]);
//! Fetch recent 10 tasks
    recentTasks = await TaskModel.find({ desk:deskId, assignedTo:user._id }).sort({ createdAt:-1 }).limit(10).select("title status priority dueDate createdAt");
  };

//? Ensure all possible statuses are included
  const taskDistribution = taskStatuses.reduce<Record<string, number>>((acc, status) => {
    const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for response keys
    acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
    return acc;
  }, {} as Record<string, number>);
  taskDistribution["All"] = totalTasks; // Add total count to taskDistribution

//? Ensure all priority levels are included
  const taskPriorityLevels = taskPriorities.reduce<Record<string, number>>((acc, priority) => {
    acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    return acc;
  }, {} as Record<string, number>);

  return { 
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
  };
};

// @desc Dashboard Data
// @route GET /api/dashboard/tasks
// @access Private (token)

export async function GET(req:NextRequest) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, token failed" }, { status:404 });

//! Get desk id
    const deskId = Object.fromEntries(req.headers.entries()).desk;
    if(!deskId) return NextResponse.json({ message:"Desk id not provided" }, { status:404 });

    const response = await getDashboardData(userToken, deskId);

    return NextResponse.json(response, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};