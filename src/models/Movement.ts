import { Schema, model, models } from "mongoose";

const MovementSchema = new Schema({
  inventory:{ type:Schema.Types.ObjectId, ref:"Inventory", required:true },
  product:{ type:Schema.Types.ObjectId, ref:"Product", required:true },
  createdBy:{ type:Schema.Types.ObjectId, ref:"User", required:true },
  type:{ type:String, enum:["inflow", "outflow"], required:true },
  category:{ type:String, required:true },
  title:{ type:String, required:[true, 'DB: Title required.'], minLength:[1, 'DB: Title must be at least 1 characters.'], maxLength:[200, 'DB: Title must be at most 200 characters.'], trim:true },
  description:{ type:String, maxLength:[600, 'DB: Description must be at most 600 characters.'], trim:true },
  quantity: { type:Number, required:true, min:1 },
  date:{ type:Date, default:Date.now },
  status: { type: String, enum: ["Pendiente", "Finalizado", "Cancelado"], default:"Finalizado" },
}, { timestamps:true });

delete models.Movement;

const MovementModel = models.Movement || model('Movement', MovementSchema);
export default MovementModel;