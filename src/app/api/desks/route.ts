import { connectDB } from "@config/db";
import { adminOnly, protectRoute } from "@middlewares/authMiddleware";
import DeskModel from "@models/Desk";
import { NextRequest, NextResponse } from "next/server";

// @desc Get all desks (Admin: all, User: only assigned desks)
// @route GET /api/desks
// @access Private

export async function GET(req:NextRequest) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

//! All desks
    let userDesks = [];
    if(userToken.role === "admin") userDesks = await DeskModel.find().populate("members", "name email profileImageUrl");
    if(userToken.role === "user") userDesks = await DeskModel.find({ members:userToken._id }).populate("members", "name email profileImageUrl");

    return NextResponse.json(userDesks, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Create desk
// @route POST /api/desks
// @access Private (Admin only)

export async function POST(req:NextRequest) {
  try {
    await connectDB();
    const { title } = await req.json();

//! Validations
    if(!title.trim()) return NextResponse.json({ message:"El título debe tener al menos 1 carácter." }, { status:400 });
    if(title.trim().length > 200) return NextResponse.json({ message:"El título puede tener un máximo de 200 caracteres." }, { status:400 });

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const newDesk = await DeskModel.create({ title, members:[userToken._id] });
    if(!newDesk) return NextResponse.json({ message:"Error creating desk" }, { status:500 });

    return NextResponse.json(newDesk, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};