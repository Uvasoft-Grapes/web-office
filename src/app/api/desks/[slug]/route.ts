import { connectDB } from "@config/db";
import { adminOnly } from "@middlewares/authMiddleware";
import DeskModel from "@models/Desk";
import { NextRequest, NextResponse } from "next/server";

// @desc Update desk
// @route PUT /api/desks/:id
// @access Private (Admin only)

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const deskId = req.url.split("/")[5].split("?")[0];
    const { title } = await req.json();

//! Validations
    if(!title.trim()) return NextResponse.json({ message:"El título debe tener al menos 1 carácter." }, { status:400 });
    if(title.trim().length > 200) return NextResponse.json({ message:"El título puede tener un máximo de 200 caracteres." }, { status:400 });

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

//! Update desk
    const updatedDesk = await DeskModel.findByIdAndUpdate(deskId, { title }, { new:true });
    if(!updatedDesk) return NextResponse.json({ message:"Error updating desk" }, { status:500 });

    return NextResponse.json(updatedDesk, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete desk
// @route DELETE /api/desks/:id
// @access Private (Admin only)

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const deskId = req.url.split("/")[5].split("?")[0];

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

//! Delete desk
    const deletedDesk = await DeskModel.findByIdAndDelete(deskId);
    if(!deletedDesk) return NextResponse.json({ message:"Error deleting desk" }, { status:500 });

    return NextResponse.json(deletedDesk, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};