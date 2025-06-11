import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyOwnerToken } from "@middlewares/authMiddleware";
import { TypeDesk, TypeUser } from "@utils/types";
import CategoryModel from "@/src/models/Category";

// @desc Update category
// @route PUT /api/categories/:id
// @access Owner, Admin

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const categoryId = req.url.split("/")[5].split("?")[0];
    const { icon, label } = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validations
    if(icon < 1) return NextResponse.json({ message:"Icono requerido." }, { status:400 });
    if(!label.trim()) return NextResponse.json({ message:"La categoría debe tener al menos 1 carácter." }, { status:400 });
    if(label.trim().length > 100) return NextResponse.json({ message:"La categoría puede tener un máximo de 100 caracteres." }, { status:400 });

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyAdminToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Update category
    const category = await CategoryModel.findByIdAndUpdate(categoryId, { icon, label }, { new:true });
    if(!category) return NextResponse.json({ message:"Error updating category" }, { status:500 });

    return NextResponse.json({ message:"Categoría actualizada", category }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete category
// @route DELETE /api/categories/:id
// @access Owner

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const categoryId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;
    
//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyOwnerToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Delete category
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
    if(!deletedCategory) return NextResponse.json({ message:"Error deleting category" }, { status:500 });

    return NextResponse.json({ message:"Categoría eliminada" }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};