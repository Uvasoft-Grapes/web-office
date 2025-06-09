import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { connectDB } from "@config/db";
import { decodedInviteToken, generateAuthToken } from "@middlewares/authMiddleware";
import UserModel from "@models/User";
import SessionModel from "@models/Session";

const { NODE_ENV } =  process.env;

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

export async function POST(req:Request) {
  try {
    await connectDB();

    const { name, email, password, profileImageUrl, token } = await req.json();

    const formattedEmail = email.toLowerCase();

//! Validations
    if(!name) return NextResponse.json({ message:"Missing name" }, { status:500 });
    if(!email) return NextResponse.json({ message:"Missing email" }, { status:500 });
    if(!password) return NextResponse.json({ message:"Missing password" }, { status:500 });
    if(!token) return NextResponse.json({ message:"Missing invite token" }, { status:500 });

//! Check if user already exists
    const userExists = await UserModel.findOne({ email:formattedEmail });
    if(userExists) return NextResponse.json({ message:"Correo no válido" }, { status:400 });

//! Determine user role
    const role = await decodedInviteToken(token);
    if(!role) return NextResponse.json({ message:"Token no válido" }, { status:401 });

//! Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

//! Create new user
    const newUser = await UserModel.create({
      name,
      email:formattedEmail,
      password:hashedPassword,
      profileImageUrl,
      role,
    });

    const authToken = generateAuthToken(newUser._id);
    if(!authToken) return NextResponse.json({ message:"Error generating token" }, { status:401 });

    const serializedAuthCookie = serialize('authToken', authToken, {
      httpOnly:true,
      secure:NODE_ENV === 'production',
      path:'/',
      sameSite:'strict',
    });

//! Create user session
    const newSession = await SessionModel.create({ user:newUser._id, checkIn:new Date() });
    if(!newSession) return NextResponse.json({ message:"Error creating session" }, { status:500 });

//! Return user data with JWT
    const res = NextResponse.json({
      message:"Sesión iniciada",
      user:{ 
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        profileImageUrl:newUser.profileImageUrl,
        role:newUser.role,
      }
    }, { status:201 });
    res.headers.set('Set-Cookie', serializedAuthCookie);

    return res;
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};