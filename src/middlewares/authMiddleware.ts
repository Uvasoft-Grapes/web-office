import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@models/User";
import DeskModel from "@models/Desk";
import { TypeUser } from "@utils/types";
import { serialize } from "cookie";

const { JWT_SECRET, NODE_ENV } =  process.env;

export interface ExtendedNextApiRequest extends NextApiRequest {
  user?:TypeUser;
}

const getErrorResponse = ({ message, status }:{ message:string, status:number }) => {
  const serializedAuthCookie = serialize('authToken', "", {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
  });
  const serializedDeskCookie = serialize('deskToken', "", {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
  });
  const res = NextResponse.json({ message }, { status });
  res.headers.set('Set-Cookie', serializedAuthCookie);
  res.headers.append('Set-Cookie', serializedDeskCookie)
  return res;
};

// Generate Login and desk Token
export const generateAuthToken = (id:string) => {
  if(!JWT_SECRET) return;
  return jwt.sign({ id:id }, JWT_SECRET, { expiresIn:"0.5d" });
};

// Generate invite Token
export const generateInviteToken = (role:"owner"|"admin"|"user"|"client") => {
  if(!JWT_SECRET) return;
  return jwt.sign({ role }, JWT_SECRET, { expiresIn:"10d" });
};

// Middleware for invite token
export const decodedInviteToken = async (token:string) => {
  if(!JWT_SECRET) return undefined;
  const decoded = jwt.verify(token, JWT_SECRET);
  if(typeof decoded !== "object" || !("role" in decoded)) return NextResponse.json({ message:"Unauthorized token" }, { status:401 });
  if(decoded.role === "admin" || decoded.role === "user") return decoded.role;
  return undefined;
};

// Middleware to verify desk token
export const verifyDeskToken = async (token:string|undefined, userId:string|undefined) => {
  if(!JWT_SECRET) return;
  try {
    if (token && userId) {
      if(token.startsWith("Bearer")) token = token.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if(typeof decoded !== "object" || !("id" in decoded)) return undefined;
      const findDesk = await DeskModel.findById(decoded.id).populate("members", "name email profileImageUrl role");
//! Verify if the user is a member
      const isMember = findDesk.members.find((member:TypeUser) => member._id.toString() === userId.toString()) || undefined;
      if(isMember) return findDesk;
      return undefined;
    } else {
      return undefined;
    };
  } catch (error) {
    console.error("Token error:", error)
    return undefined;
  };
};

// Middleware for Owner-only access
export const verifyOwnerToken = async (token:string|undefined) => {
  if(!JWT_SECRET) return getErrorResponse({ message:"Server error", status:500 });
  try {
    if(token) {
      const decoded = jwt.verify(token, JWT_SECRET);
//! Wrong token
      if(typeof decoded !== "object" || !("id" in decoded)) return getErrorResponse({ message:"Token error", status:401 });

      const findUser = await UserModel.findById(decoded.id).select("-password");

//! User not found
      if(!findUser) return getErrorResponse({ message:"User not found", status:404 });

//? OK
      if(findUser.role === "owner") return findUser;

//! Role not allowed
      return getErrorResponse({ message:"Acceso denegado", status:403 });

    } else {
//! Inactive session
      return getErrorResponse({ message:"Sesión inactiva", status:401 });
    };
  } catch (error) {
    console.error("Token error:", error)
    return getErrorResponse({ message:"Acceso denegado", status:401 });
  };
};

// Middleware for Admin access
export const verifyAdminToken = async (token:string|undefined) => {
  if(!JWT_SECRET) return getErrorResponse({ message:"Server error", status:500 });
  try {
    if(token) {
      const decoded = jwt.verify(token, JWT_SECRET);
//! Wrong token
      if(typeof decoded !== "object" || !("id" in decoded)) return getErrorResponse({ message:"Token error", status:401 });

      const findUser = await UserModel.findById(decoded.id).select("-password");

//! User not found
      if(!findUser) return getErrorResponse({ message:"User not found", status:404 });

//? OK
      if(findUser.role === "admin" || findUser.role === "owner") return findUser;

//! Role not allowed
      return getErrorResponse({ message:"Acceso denegado", status:403 });

    } else {
//! Inactive session
      return getErrorResponse({ message:"Sesión inactiva", status:401 });
    };
  } catch (error) {
    console.error("Token error:", error)
    return getErrorResponse({ message:"Acceso denegado", status:401 });
  };
};

// Middleware to protect routes
export const verifyUserToken = async (token:string|undefined) => {
  if(!JWT_SECRET) return getErrorResponse({ message:"Server error", status:500 });
  try {
    if(token) {
      const decoded = jwt.verify(token, JWT_SECRET);
//! Wrong token
      if(typeof decoded !== "object" || !("id" in decoded)) return getErrorResponse({ message:"Token error", status:401 });

      const findUser = await UserModel.findById(decoded.id).select("-password");

//! User not found
      if(!findUser) return getErrorResponse({ message:"User not found", status:404 });

//? OK
      if(findUser) return findUser;

//! Role not allowed
      return getErrorResponse({ message:"Acceso denegado", status:403 });

    } else {
//! Inactive session
      return getErrorResponse({ message:"Sesión inactiva", status:401 });
    };
  } catch (error) {
    console.error("Token error:", error)
    return getErrorResponse({ message:"Acceso denegado", status:401 });
  };
};