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
    console.log(error)
    return undefined;
  }
};

// Middleware for Admin-only access
export const adminOnly = async (token:string) => {
  if(!JWT_SECRET) return;
  if(token) {
    if(token.startsWith("Bearer")) token = token.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if(typeof decoded !== "object" || !("id" in decoded)) return NextResponse.json({ message:"No authorized, no token" }, { status:401 });;
    const findUser = await UserModel.findById(decoded.id).select("-password");
    if(findUser && findUser.role === "admin") return findUser;
    return undefined;
    // NextResponse.json({ message:"Access denied, admin only" }, { status:403 });
  } else {
    return undefined;
    // return NextResponse.json({ message:"Access denied, admin only" }, { status:403 });
  };
};



// export const protect = async (req:ExtendedNextApiRequest, res:NextApiResponse, next:()=>void) => {
//   if(!JWT_SECRET) return;
//   try {
//     let token = req.headers.authorization;
//     if (token && token.startsWith("Bearer")) {
//       token = token.split(" ")[1]; // Extract token
//       const decoded = jwt.verify(token, JWT_SECRET);
//       if(typeof decoded !== "object" || !("id" in decoded)) return;
//       const findUser = await UserModel.findById(decoded.id).select("-password");
//       req.user = findUser;
//       next();
//       // return NextResponse.json(findUser, { status:201 });
//     } else {
//       return NextResponse.json({ message:"No authorized, no token" }, { status:401 });
//     };
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({ message:"Token failed", error }, { status:401 });
//   }
// };

// export const adminOnly = async (req:ExtendedNextApiRequest, res:NextApiResponse, next:()=>void) => {
//   if(req.user && req.user.role === "admin") {
//     next();
//   } else {
//     return NextResponse.json({ message:"Access denied, admin only" }, { status:403 });
//   };
// };