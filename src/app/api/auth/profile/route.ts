import { connectDB } from "@/src/config/db";
import { protectRoute } from "@/src/middlewares/authMiddleware";
import UserModel from "@models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const { JWT_SECRET } =  process.env;

// Generate JWT Token
const generateToken = (userId:string) => {
  if(!JWT_SECRET) return;
  return jwt.sign({ id:userId }, JWT_SECRET, { expiresIn:"7d" })
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private (Requires JWT)

export async function GET(req:NextRequest) {
  try {
    await connectDB();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

//! Find user
    const user = await UserModel.findById(userToken._id);
    if(!user) return NextResponse.json({ message:"User not found" }, { status:404 });

//! Return user data
    return NextResponse.json(user, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private (Requires JWT)

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Token failed" }, { status:404 });

    const user = await UserModel.findById(userToken._id);
    if(!user) return NextResponse.json({ message:"User not found" }, { status:404 });

    user.name = name || user.name;
    user.email = email || user.email;

    if(password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
    };

    const updatedUser = await user.save();

    return NextResponse.json({ 
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      profileImageUrl:updatedUser.profileImageUrl,
      role:updatedUser.role,
      token:generateToken(updatedUser._id),
    }, { status:201 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};