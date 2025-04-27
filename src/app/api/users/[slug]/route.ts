import { connectDB } from "@config/db";
import { adminOnly, protectRoute } from "@middlewares/authMiddleware";
import UserModel from "@models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const { JWT_SECRET } =  process.env;

const generateToken = (userId:string) => {
  if(!JWT_SECRET) return;
  return jwt.sign({ id:userId }, JWT_SECRET, { expiresIn:"7d" })
};

const hashedPassword = async (newPassword:string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  return hash;
};

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

// @desc Update user
// @route PUT /api/users/:id
// @access Private

export async function PUT(req:Request) {
  try {
    await connectDB();

    const { name, email, newPassword, password, profileImageUrl } = await req.json();

    const formattedEmail = email.toLowerCase().trim();

//! Validations
    if(!name) return NextResponse.json({ message:"Missing name" }, { status:500 });
    if(!email) return NextResponse.json({ message:"Missing email" }, { status:500 });
    if(!profileImageUrl) return NextResponse.json({ message:"Missing profile image" }, { status:500 });
    if(!password) return NextResponse.json({ message:"Unauthorized" }, { status:500 });

//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await protectRoute(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, invalid token" }, { status:404 });

//! Find user
    const user = await UserModel.findOne({ email:userToken.email }).select("+password");
    if(!user) return NextResponse.json({ message:"Token error" }, { status:401 });

//! Check if email already exists
    const emailExists = await UserModel.findOne({ email:formattedEmail });
    if(user.email !== formattedEmail && emailExists) return NextResponse.json({ message:"El correo ya esta registrado" }, { status:400 });

//! Compare current password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return NextResponse.json({ message:"Contraseña incorrecta" }, { status:400 });

//! Hash new password if provided 
    const hash = newPassword ? await hashedPassword(newPassword) : user.password;

//! Update user
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
      name,
      email:formattedEmail,
      password:hash,
      profileImageUrl,
    }, { new:true });

//! Return user data with JWT
    return NextResponse.json({ 
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      profileImageUrl:updatedUser.profileImageUrl,
      role:updatedUser.role,
      token:generateToken(updatedUser._id),
    }, { status:201 });

  } catch (error) {
    return NextResponse.json({ message:"Unauthorized token", error }, { status:500 });
  };
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