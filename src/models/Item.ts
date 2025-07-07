import { Schema, model, models } from "mongoose";

const ItemSchema = new Schema({
  inventory:{ type:Schema.Types.ObjectId, ref:'Inventory', required:[true, 'DB: Inventory required.'] },
  category:{ type:Schema.Types.ObjectId||undefined, ref:'Category', default:undefined },
  title:{ type:String, required:[true, 'DB: Title required.'], minLength:[1, 'DB: Title must be at least 1 characters.'], maxLength:[200, 'DB: Title must be at most 200 characters.'], trim:true },
  description:{ type:String, maxLength:[600, 'DB: Description must be at most 600 characters.'], trim:true },
  stock:{ type:Number, default:0 },
  price:{ type:Number, default:0 },
}, { timestamps:true });

delete models.Item;

const ItemModel = models.Item || model('Item', ItemSchema);
export default ItemModel;