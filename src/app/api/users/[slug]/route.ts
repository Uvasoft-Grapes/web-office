import { connectDB } from "@/src/config/db";
import { adminOnly, protectRoute } from "@/src/middlewares/authMiddleware";
import UserModel from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const userId = req.url.split("/")[5].split("?")[0];

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const users = await UserModel.findById(userId);

    return NextResponse.json(users, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private (Admin only)

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const userId = req.url.split("/")[5].split("?")[0];

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if(!deletedUser) return NextResponse.json({ message:"User not found" }, { status:404 });

    return NextResponse.json(deletedUser, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};