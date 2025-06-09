import { NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken } from "@middlewares/authMiddleware";
import MovementModel from "@models/Movement";
import ProductModel from "@models/Product";
import { TypeDesk, TypeUser } from "@utils/types";

const STATUSES = [
  "Pendiente",
  "Finalizado",
  "Cancelado"
];

// @desc Create a new movement
// @route POST /api/movements
// @access Owner, Admin

export async function POST(req:Request) {
  try {
    await connectDB();
    const { inventory, product, type, title, description, quantity, date, category, status } = await req.json();
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
    if(!inventory) return NextResponse.json({ message:"Missing inventory" }, { status:400 });
    if(!product) return NextResponse.json({ message:"Missing product" }, { status:400 });
    if(type !== "inflow" && type !== "outflow") return NextResponse.json({ message:"Missing type" }, { status:400 });
    if(!title.trim()) return NextResponse.json({ message:"El título debe tener al menos 1 carácter." }, { status:400 });
    if(title.trim().length > 200) return NextResponse.json({ message:"El título puede tener un máximo de 200 caracteres." }, { status:400 });
    if(description.trim().length > 600) return NextResponse.json({ message:"La descripción puede tener un máximo de 600 caracteres." }, { status:400 });
    if(!quantity) return NextResponse.json({ message:"Missing quantity" }, { status:400 });
    if(!date) return NextResponse.json({ message:"Missing date" }, { status:400 });
    if(!category) return NextResponse.json({ message:"Missing category" }, { status:400 });
    if(!status || !STATUSES.includes(status)) return NextResponse.json({ message:"Missing status" }, { status:400 });

    const newMovement = await MovementModel.create({
      inventory,
      product,
      createdBy:userToken._id,
      type,
      title,
      description,
      quantity,
      date,
      category,
      status
    });
    if(!newMovement) return NextResponse.json({ message:"Create movement error"}, { status:500 });

    if(status === "Finalizado") {
      const updatedProduct = await ProductModel.findByIdAndUpdate(product, { $inc:{ stock:type === "inflow" ? quantity : -quantity }, }, { new:true });
      if(!updatedProduct) return NextResponse.json({ message:"Account not found"}, { status:404 });
    };

    const movement = await MovementModel.findById(newMovement._id).populate("createdBy", "name email profileImageUrl").populate("inventory").populate("product");
    if(!movement) return NextResponse.json({ message:"Movement not found"}, { status:404 });

    return NextResponse.json({ message:"Movimiento creado", inventory }, { status:201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};