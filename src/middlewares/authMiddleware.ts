import jwt from "jsonwebtoken";
import UserModel from "@models/User";
import { NextApiRequest } from "next";
import { TypeUser } from "@utils/types";
import { NextResponse } from "next/server";

const { JWT_SECRET } =  process.env;

export interface ExtendedNextApiRequest extends NextApiRequest {
  user?:TypeUser;
}

// Middleware to protect routes
export const protectRoute = async (token:string|undefined) => {
  if(!JWT_SECRET) return;
  try {
    if (token) {
      if(token.startsWith("Bearer")) token = token.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if(typeof decoded !== "object" || !("id" in decoded)) return NextResponse.json({ message:"No authorized, no token" }, { status:401 });;
      const findUser = await UserModel.findById(decoded.id).select("-password");
      if(findUser) return findUser;
      return undefined;
    } else {
      return undefined;
    };
  } catch (error) {
    console.error("Token error:", error)
    return undefined;
  }
};

// Middleware for Admin-only access
export const adminOnly = async (token:string) => {
  if(!JWT_SECRET) return;
  if(token) {
    if(token.startsWith("Bearer")) token = token.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if(typeof decoded !== "object" || !("id" in decoded)) return NextResponse.json({ message:"No authorized, no token" }, { status:401 });
    const findUser = await UserModel.findById(decoded.id).select("-password");
    if(findUser && findUser.role === "admin") return findUser;
    return undefined;
    // NextResponse.json({ message:"Access denied, admin only" }, { status:403 });
  } else {
    return undefined;
    // return NextResponse.json({ message:"Access denied, admin only" }, { status:403 });
  };
};

// Middleware for invite token
export const decodedInviteToken = async (token:string) => {
  if(!JWT_SECRET) return;
  const decoded = jwt.verify(token, JWT_SECRET);
  if(typeof decoded !== "object" || !("role" in decoded)) return NextResponse.json({ message:"Unauthorized token" }, { status:401 });
  if(decoded.role === "admin" || decoded.role === "user") return decoded.role;
  return undefined;
};