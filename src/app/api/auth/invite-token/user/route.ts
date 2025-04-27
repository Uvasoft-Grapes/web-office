import { adminOnly } from "@middlewares/authMiddleware";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const { JWT_SECRET } =  process.env;

// Generate JWT Token
const generateToken = () => {
  if(!JWT_SECRET) return;
  return jwt.sign({ role:"user" }, JWT_SECRET, { expiresIn:"7d" });
};

// @desc Create Invite Token
// @route POST /api/auth/invite-token
// @access Priv (admin only)

export async function GET(req:Request) {
  try {
//! Validate token
    const token = Object.fromEntries(req.headers.entries()).authorization;
    const userToken = await adminOnly(token);
    if(!userToken) return NextResponse.json({ message:"Access denied, admin only" }, { status:404 });

    const inviteToken = generateToken();
    if(!inviteToken) return NextResponse.json({ message:"Server error" }, { status:500 });

    return NextResponse.json(inviteToken, { status:200 });

  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  }
};