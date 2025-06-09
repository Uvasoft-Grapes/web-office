import { NextResponse } from "next/server";
import { parse } from "cookie";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyUserToken } from "@middlewares/authMiddleware";
import ProductModel from "@models/Product";
import MovementModel from "@models/Movement";
import { TypeDesk, TypeInventory, TypeUser } from "@utils/types";

// @desc Get all Products
// @route GET /api/inventories/products
// @access Owner, Admin, User, Client

export async function GET(req:Request) {
  try {
    await connectDB();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

    const queries = req.url.split("?")[1]?.split("&") || [];
    const queryTitle = queries.find(item => item.includes("title="))?.split("=")[1];
    const queryCategory = queries.find(item => item.includes("category="))?.split("=")[1];
    const queryInventory = queries.find(item => item.includes("inventory="))?.split("=")[1];
    const filter = {
      title:queryTitle ? decodeURIComponent(queryTitle).replace("+", " ") : undefined,
      category:queryCategory ? decodeURIComponent(queryCategory).replace("+", " ") : undefined,
      inventory:queryInventory ? decodeURIComponent(queryInventory).replace("+", " ") : undefined,
    };

    const querySort = queries.find(item => item.includes("sort="))?.split("=")[1];
    const sort =  querySort ? decodeURIComponent(querySort).replace(/\+/g, " ") : "Fecha Final (asc)";

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! All products
    let products = await ProductModel.find({ desk:desk._id });

//! Filter products
    if(filter.title) products = products.filter(product => product.title.toLowercase().includes(filter.title));
    if(filter.category) products = products.filter(product => product.category === filter.category);
    if(filter.inventory) products = products.filter(product => product.stocks.includes((stock:{ inventory:TypeInventory, stock:number }) => stock.inventory._id === filter.inventory));

//! Sort Products
    if(sort === "Título (asc)") products = products.sort((a, b) => a.title.localeCompare(b.title));
    if(sort === "Título (desc)") products = products.sort((a, b) => b.title.localeCompare(a.title));
    if(sort === "Precio (asc)") products = products.sort((a, b) => a.price - b.price);
    if(sort === "Precio (desc)") products = products.sort((a, b) => b.price - a.price);
    if(sort === "Stock (asc)") products = products.sort((a, b) => a.stock - b.stock);
    if(sort === "Stock (desc)") products = products.sort((a, b) => b.stock - a.stock);

//! Add movements
    products = await Promise.all(products.map(async (product) => {
      const movements = await MovementModel.find({ product:product._id }).populate("createdBy", "name email profileImageUrl");
      if(!movements) return NextResponse.json({ message:"Movements not found" }, { status:404 });
      return { ...product._doc, movements };
    }));

    return NextResponse.json(products, { status:200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Create a new product
// @route POST /api/products
// @access Owner, Admin

export async function POST(req:Request) {
  try {
    await connectDB();
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

    const newProduct = await ProductModel.create({
      desk:desk._id,
      title,
      description,
      category,
      price:Number(price),
    });
    if(!newProduct) return NextResponse.json({ message:"Create product error"}, { status:500 });

    const product = await ProductModel.findById(newProduct._id);
    if(!product) return NextResponse.json({ message:"Product not found"}, { status:404 });

    return NextResponse.json({ message:"Producto creado", product }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};