import { NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyOwnerToken } from "@middlewares/authMiddleware";
import EventModel from "@models/Event";
import { TypeDesk, TypeUser } from "@utils/types";

// @desc Update event
// @route PUT /api/events/:id
// @access Owner, Admin

export async function PUT(req:Request) {
  try {
    await connectDB();
    const eventId = req.url.split("/")[5].split("?")[0];
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

    const updatedEvent = await EventModel.findByIdAndUpdate(eventId, {
      folder,
      title,
      description,
      startDate,
      endDate,
      assignedTo,
      recurrence:frequency !== "none" ? { frequency, endFrequency } : undefined,
      createdBy:userToken._id,
    });
    if(!updatedEvent) return NextResponse.json({ message:"Update event error"}, { status:500 });

    const event = await EventModel.findById(eventId).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!event) return NextResponse.json({ message:"Event not found"}, { status:404 });

    return NextResponse.json({ message:"Evento actualizado", event }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete event
// @route DELETE /api/events/:id
// @access Owner

export async function DELETE(req:Request) {
  try {
    await connectDB();
    const eventId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyOwnerToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Delete Event
    const event = await EventModel.findByIdAndDelete(eventId).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!event) return NextResponse.json({ message:"Event not found" }, { status:404 });

    return NextResponse.json({ message:"Evento eliminado" }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};