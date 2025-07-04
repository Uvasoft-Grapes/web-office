import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyOwnerToken, verifyUserToken } from "@middlewares/authMiddleware";
import ProductModel from "@models/Product";
import StockModel from "@models/Stock";
import { TypeDesk, TypeUser } from "@utils/types";

// @desc Get product by ID
// @route GET /api/products/:id
// @access Owner, Admin, User, Client

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const productId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Find Product
    const product = await ProductModel.findById(productId).populate("folder", "title").populate("category");
    if(!product) return NextResponse.json({ message:"Product not found" }, { status:404 });

//! Find Stocks
    const stocks = await StockModel.find({ product:product._id }).populate("inventory");

    return NextResponse.json({ product, stocks }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Update product details
// @route PUT /api/products/:id
// @access Owner, Admin

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const productId = req.url.split("/")[5].split("?")[0];
    const { title, description, category, price } = await req.json();
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
    if(!title.trim()) return NextResponse.json({ message:"El título debe tener al menos 1 carácter." }, { status:400 });
    if(title.trim().length > 200) return NextResponse.json({ message:"El título puede tener un máximo de 200 caracteres." }, { status:400 });
    if(!category) return NextResponse.json({ message:"Categoría obligatoria" }, { status:400 });
    if(Number(price) < 0) return NextResponse.json({ message:"Precio obligatorio" }, { status:400 });

//! Update Product
    const product = await ProductModel.findById(productId);
    if(!product) return NextResponse.json({ message:"Product not found" }, { status:404 });

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;

    await product.save();

    return NextResponse.json({ message:"Producto actualizado", product }, { status:201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private Owner

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const productId = req.url.split("/")[5].split("?")[0];
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

//! Delete Product
    const product = await ProductModel.findByIdAndDelete(productId);
    if(!product) return NextResponse.json({ message:"Product not found" }, { status:404 });
  //? Delete Stocks
    const deletedStocks = await StockModel.deleteMany({ product:product._id });
    if(!deletedStocks.acknowledged) return NextResponse.json({ message:"Error deleting stocks" }, { status:500 });

    return NextResponse.json({ message:"Producto eliminado" }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};