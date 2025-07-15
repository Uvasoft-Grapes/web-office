import { Schema, model, models } from 'mongoose';
import "./Desk";
import "./Folder";
import "./User";

const ReportSchema = new Schema({
  desk:{ type:Schema.Types.ObjectId, ref:'Desk', required:[true, 'DB: Desk required.'] },
  folder:{ type:Schema.Types.ObjectId, ref:'Folder', required:[true, 'DB: Folder required.'] },
  createdBy:{ type:Schema.Types.ObjectId, ref:'User' },
  title:{ type:String, required:[true, 'DB: Title required.'], minLength:[1, 'DB: Title must be at least 1 characters.'], maxLength:[200, 'DB: Title must be at most 200 characters.'], trim:true },
  description:{ type:String, maxLength:[600, 'DB: Description must be at most 600 characters.'], trim:true },
  date:{ type:Date, required:[true, 'DB: Due date required.'] },
}, { timestamps:true });

// delete models.Report;

const ReportModel = models.Report || model('Report', ReportSchema);
export default ReportModel;