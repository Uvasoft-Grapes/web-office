import { connectDB } from "@config/db";
import { adminOnly } from "@middlewares/authMiddleware";
import UserModel from "@models/User";
import { NextRequest, NextResponse } from "next/server";

// @desc Update user role
// @route PUT /api/users/:id/role
// @access Private (Admin only)

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const userId = req.url.split("/")[5].split("?")[0];
    const { role } = await req.json();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { role });
    if(!updatedUser) return NextResponse.json({ message:"User not found" }, { status:404 });

    return NextResponse.json(updatedUser, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};