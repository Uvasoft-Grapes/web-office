import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { compareAsc, compareDesc } from "date-fns";
import { connectDB } from "@config/db";
import { verifyAdminToken, verifyDeskToken, verifyOwnerToken, verifyUserToken } from "@middlewares/authMiddleware";
import InventoryModel from "@models/Inventory";
import MovementModel from "@models/Movement";
import ProductModel from "@models/Product";
import { TypeDesk, TypeUser } from "@utils/types";

const statusManagement: Record<string, number> = {
  "Pendiente": 1,
  "Finalizado": 2,
  "Cancelado": 3,
};

// @desc Get inventory by ID
// @route GET /api/inventories/:id
// @access Owner, Assigned

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const inventoryId = req.url.split("/")[5].split("?")[0];
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

    const queries = req.url.split("?")[1]?.split("&");
    const queryStatus = queries.find(item => item.includes("status="))?.split("=")[1];
    const queryType = queries.find(item => item.includes("type="))?.split("=")[1];
    const queryCategory = queries.find(item => item.includes("category="))?.split("=")[1];
    const queryProduct = queries.find(item => item.includes("product="))?.split("=")[1];
    const filter = {
      status:queryStatus ? decodeURIComponent(queryStatus).replace("+", " ") : undefined,
      type:queryType ? decodeURIComponent(queryType).replace("+", " ") : undefined,
      category:queryCategory ? decodeURIComponent(queryCategory).replace("+", " ") : undefined,
      product:queryProduct ? decodeURIComponent(queryProduct).replace("+", " ") : undefined,
    };
    const querySort = queries.find(item => item.includes("sort="))?.split("=")[1];
    const sort =  querySort ? decodeURIComponent(querySort).replace(/\+/g, " ") : "Fecha (desc)";

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

//! Find Inventory
    const inventory = await InventoryModel.findById(inventoryId).populate("assignedTo", "name email profileImageUrl").populate("folder", "title");
    if(!inventory) return NextResponse.json({ message:"Inventory not found" }, { status:404 });
    if(userToken.role !== "owner" && !inventory.assignedTo.find((user:TypeUser) => user._id.toString() === userToken._id.toString())) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });
  //? Status summary counts
    const statusSummary = {
      pending:await MovementModel.countDocuments({ status:"Pendiente", inventory:inventory._id }),
      completed:await MovementModel.countDocuments({ status:"Finalizado", inventory:inventory._id }),
      canceled:await MovementModel.countDocuments({ status:"Cancelado", inventory:inventory._id }),
    };

//! Find Products
    const products = await ProductModel.find({ desk:desk._id }).populate("category");
    if(!products) return NextResponse.json({ message:"Products not found" }, { status:404 });

//! Find Movements
    let movements = await MovementModel.find({ inventory:inventoryId }).populate("createdBy", "name email profileImageUrl").populate("product", "title description category price stock").populate("category");
    if(!movements) return NextResponse.json({ message:"Movements not found" }, { status:404 });
  //? Filter movements
    if(filter.status) movements = movements.filter(movement => movement.status === filter.status);
    if(filter.type) movements = movements.filter(movement => movement.type === filter.type);
    if(filter.category) movements = movements.filter(movement => movement.category._id.toString() === filter.category);
    if(filter.product) movements = movements.filter(movement => movement.product._id.toString() === filter.product);

  //? Sort movements
    if(sort === "Fecha (desc)") movements = movements.sort((a, b) => compareDesc(a.date, b.date));
    if(sort === "Fecha (asc)") movements = movements.sort((a, b) => compareAsc(a.date, b.date));
    if(sort === "Estado (asc)") movements = movements.sort((a, b) => statusManagement[b.status] - statusManagement[a.status]);
    if(sort === "Estado (desc)") movements = movements.sort((a, b) => statusManagement[a.status] - statusManagement[b.status]);
    if(sort === "Título (asc)") movements = movements.sort((a, b) => a.title.localeCompare(b.title));
    if(sort === "Título (desc)") movements = movements.sort((a, b) => b.title.localeCompare(a.title));

    return NextResponse.json({ ...inventory._doc, products, statusSummary, movements }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Update inventory details
// @route PUT /api/inventories/:id
// @access Owner, Admin

export async function PUT(req:NextRequest) {
  try {
    await connectDB();
    const inventoryId = req.url.split("/")[5].split("?")[0];
    const { folder, title, location, assignedTo } = await req.json();
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
    if(!Array.isArray(assignedTo)) return NextResponse.json({ message:"AssignedTo must be an array of users IDs" }, { status:400 });
    if(!assignedTo.includes(userToken._id.toString())) assignedTo.push(userToken._id.toString());

//! Update Inventory
    const updatedInventory = await InventoryModel.findById(inventoryId);
    if(!updatedInventory) return NextResponse.json({ message:"Inventory not found" }, { status:404 });

    updatedInventory.folder = folder || updatedInventory.folder;
    updatedInventory.title = title || updatedInventory.title;
    updatedInventory.location = location || updatedInventory.location;
    updatedInventory.assignedTo = assignedTo || updatedInventory.assignedTo;
    await updatedInventory.save();

    return NextResponse.json({ message:"Inventario actualizado" }, { status:201 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};

// @desc Delete inventory
// @route DELETE /api/inventories/:id
// @access Private Owner

export async function DELETE(req:NextRequest) {
  try {
    await connectDB();
    const inventoryId = req.url.split("/")[5].split("?")[0];
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

//! Delete Inventory
    const inventory = await InventoryModel.findByIdAndDelete(inventoryId);
    if(!inventory) return NextResponse.json({ message:"Inventory not found" }, { status:404 });
  //? Delete Movements
    const deletedMovements = await MovementModel.deleteMany({ inventory:inventory._id });
    if(!deletedMovements.acknowledged) return NextResponse.json({ message:"Error deleting movements" }, { status:500 });

    return NextResponse.json({ message:"Inventario eliminado" }, { status:200 });
  } catch (error) {
    return NextResponse.json({ message:"Server error", error }, { status:500 });
  };
};