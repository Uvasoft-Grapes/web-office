import { Schema, model, models } from "mongoose";

// const stockSchema = new Schema({
//   inventory:{ type:Schema.Types.ObjectId, ref:'Inventory' },
//   stock:{ type:Number, default:0 },
// });

const ProductSchema = new Schema({
  desk:{ type:Schema.Types.ObjectId, ref:'Desk', required:[true, 'DB: Desk required.'] },
  title:{ type:String, required:[true, 'DB: Title required.'], minLength:[1, 'DB: Title must be at least 1 characters.'], maxLength:[200, 'DB: Title must be at most 200 characters.'], trim:true },
  description:{ type:String, maxLength:[600, 'DB: Description must be at most 600 characters.'], trim:true },
  category:{ type:String, required:true },
  price:{ type:Number, default:0 },
  stock:{ type:Number, default:0 },
}, { timestamps:true });

delete models.Product;

const ProductModel = models.Product || model('Product', ProductSchema);
export default ProductModel;