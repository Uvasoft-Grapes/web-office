import { NextResponse } from "next/server";
import { parse } from "cookie";
import { isBefore, isSameMonth } from "date-fns";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyUserToken } from "@middlewares/authMiddleware";
import EventModel from "@models/Event";
import { TypeDesk, TypeEvent, TypeUser } from "@utils/types";

// @desc Get all events
// @route GET /api/events
// @access Owner|Admin:all, User|Client:only assigned tasks

export async function GET(req:Request) {
  try {
    await connectDB();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

    const queries = req.url.split("?")[1]?.split("&");
    const queryDate = queries.find(item => item.includes("date="))?.split("=")[1];
    const queryFolder = queries.find(item => item.includes("folder="))?.split("=")[1];
    const filter = {
      date:queryDate ? decodeURIComponent(queryDate).replace("+", " ") : undefined,
      folder:queryFolder ? decodeURIComponent(queryFolder).replace("+", " ") : undefined,
    };

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! All events
    let events:TypeEvent[] = [];
    if(userToken.role === "owner" || userToken.role === "admin") events = await EventModel.find({ desk:desk._id }).populate("assignedTo", "name email profileImageUrl").populate("folder", "title").sort({ startDate:-1 });
    if(userToken.role === "user" || userToken.role === "client") events = await EventModel.find({ desk:desk._id, assignedTo:userToken._id }).populate("assignedTo", "name email profileImageUrl").populate("folder", "title").sort({ startDate:1 });;

//! Filter events
    const date = filter.date ? new Date(filter.date) : new Date();
    events = events.filter(event => isSameMonth(new Date(event.startDate), date) || isSameMonth(new Date(event.endDate), date) || event.recurrence && isBefore(date, event.recurrence.endFrequency));
    if(filter.folder) events = events.filter(event => event.folder._id.toString() === filter.folder);

    return NextResponse.json(events, { status:200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Create a new event
// @route POST /api/events
// @access Owner, Admin

export async function POST(req:Request) {
  try {
    await connectDB();
    const { folder, assignedTo, title, description, startDate, endDate, frequency, endFrequency } = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyAdminToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Validations
    if(!folder) return NextResponse.json({ message:"Folder required" }, { status:400 });
    if(!title) return NextResponse.json({ message:"Title required" }, { status:400 });
    if(!startDate) return NextResponse.json({ message:"Start date required" }, { status:400 });
    if(!endDate) return NextResponse.json({ message:"End date required" }, { status:400 });
    if(!Array.isArray(assignedTo)) return NextResponse.json({ message:"AssignedTo must be an array of users IDs" }, { status:400 });

    const newEvent = await EventModel.create({
      desk:desk._id,
      folder,
      title,
      description,
      startDate,
      endDate,
      assignedTo,
      recurrence:frequency !== "none" ? { frequency, endFrequency } : undefined,
      createdBy:userToken._id,
    });
    if(!newEvent) return NextResponse.json({ message:"Create event error"}, { status:500 });

    const event = await EventModel.findById(newEvent._id).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!event) return NextResponse.json({ message:"Task not found"}, { status:404 });

    return NextResponse.json({ message:"Evento creado", event }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};