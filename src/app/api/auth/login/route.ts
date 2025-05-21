import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { serialize } from 'cookie';
import { connectDB } from "@config/db";
import UserModel from "@models/User";
import SessionModel from "@models/Session";
import { generateAuthToken } from "@/src/middlewares/authMiddleware";

const { NODE_ENV } =  process.env;

// @desc Login user
// @route POST /api/auth/login
// @access Public

export async function POST(req:Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

//! Validations
    const formattedEmail = email.toLowerCase().trim();
    if(!email) return NextResponse.json({ message:"Missing email" }, { status:500 });
    if(!password) return NextResponse.json({ message:"Missing password" }, { status:500 });

//! Find user
    const user = await UserModel.findOne({ email:formattedEmail }).select("+password");
    if(!user) return NextResponse.json({ message:"Invalid email or password" }, { status:401 });

//! Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return NextResponse.json({ message:"Invalid email or password" }, { status:401 });

    const token = generateAuthToken(user._id);
    if(!token) return NextResponse.json({ message:"Error generating token" }, { status:401 });

    const serializedAuthCookie = serialize('authToken', token, {
      httpOnly:true,
      secure:NODE_ENV === 'production',
      path:'/',
      sameSite:'strict',
    });

//! Create user session
    const newSession = await SessionModel.create({ user:user._id, checkIn:new Date() });
    if(!newSession) return NextResponse.json({ message:"Error creating session" }, { status:500 });

//! Return user data with JWT
    const res = NextResponse.json({
      message:"Sesión iniciada",
      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,
      }
    }, { status: 200 });
    res.headers.set('Set-Cookie', serializedAuthCookie);

    //! Return user data with JWT
    return res;
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};