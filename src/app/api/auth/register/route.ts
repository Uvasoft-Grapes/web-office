import { connectDB } from "@config/db";
import UserModel from "@models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const { JWT_SECRET, ADMIN_INVITE_TOKEN } =  process.env;

// Generate JWT Token
const generateToken = (userId:string) => {
  if(!JWT_SECRET) return;
  return jwt.sign({ id:userId }, JWT_SECRET, { expiresIn:"7d" })
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

export async function POST(req:Request) {
  try {
    await connectDB();

    const { name, email, password, profileImageUrl, adminInviteToken } = await req.json();

//! Validations
    if(!name) return NextResponse.json({ message:"Missing name" }, { status:500 });
    if(!email) return NextResponse.json({ message:"Missing email" }, { status:500 });
    if(!password) return NextResponse.json({ message:"Missing password" }, { status:500 });

//! Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if(userExists) return NextResponse.json({ message:"User already exists" }, { status:400 });

//! Determine user role: Admin if correct token is provided, otherwise User
    let role = "user";
    if(adminInviteToken && adminInviteToken === ADMIN_INVITE_TOKEN) role = "admin";

//! Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

//! Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password:hashedPassword,
      profileImageUrl,
      role,
    });

//! Return user data with JWT
    return NextResponse.json({ 
      _id:newUser._id,
      name:newUser.name,
      email:newUser.email,
      profileImageUrl:newUser.profileImageUrl,
      role:newUser.role,
      token:generateToken(newUser._id),
    }, { status:201 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};