import { Schema, model, models } from "mongoose";

const StockSchema = new Schema({
  inventory:{ type:Schema.Types.ObjectId, ref:"Inventory", required:true },
  product:{ type:Schema.Types.ObjectId, ref:"Product", required:true },
  quantity: { type:Number, required:true, min:1 },
}, { timestamps:true });

// delete models.Stock;

const StockModel = models.Stock || model('Stock', StockSchema);
export default StockModel;