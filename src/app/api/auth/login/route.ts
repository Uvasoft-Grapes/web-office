import { connectDB } from "@config/db";
import UserModel from "@models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const { JWT_SECRET } =  process.env;

// Generate JWT Token
const generateToken = (userId:string) => {
  if(!JWT_SECRET) return;
  return jwt.sign({ id:userId }, JWT_SECRET, { expiresIn:"7d" })
};

// @desc Login user
// @route POST /api/auth/login
// @access Public

export async function POST(req:Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const formattedEmail = email.toLowerCase().trim();

//! Validations
    if(!email) return NextResponse.json({ message:"Missing email" }, { status:500 });
    if(!password) return NextResponse.json({ message:"Missing password" }, { status:500 });

//! Find user
    const user = await UserModel.findOne({ email:formattedEmail }).select("+password");
    if(!user) return NextResponse.json({ message:"Invalid email or password" }, { status:401 });

//! Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return NextResponse.json({ message:"Invalid email or password" }, { status:401 });

//! Return user data with JWT
    return NextResponse.json({ 
      _id:user._id,
      name:user.name,
      email:user.email,
      profileImageUrl:user.profileImageUrl,
      role:user.role,
      token:generateToken(user._id),
    }, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};