import { protectRoute } from "@/src/middlewares/authMiddleware";
import { BASE_URL } from "@/src/utils/apiPaths";
import { upload } from "@middlewares/uploadMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {
//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    console.log(userToken)
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    upload.single("image");

    const file = await req.blob();
    if(!file) return NextResponse.json({ message:"No file uploaded" }, { status:400 });

    const imageUrl = `${BASE_URL}/uploads/${userToken._id}`;

    return NextResponse.json({ imageUrl }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};