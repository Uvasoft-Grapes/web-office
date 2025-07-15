import { Schema, model, models } from 'mongoose';
import "./Desk";
import "./Folder";
import "./User";

const objectiveSchema = new Schema({
  text:{ type:String, required:[true, 'DB: Text required.'], minLength:[1, 'DB: Text must be at least 1 characters.'], maxLength:[600, 'DB: Text must be at most 600 characters.'], trim:true },
  dueDate:{ type:Date, required:[true, 'DB: Due date required.'] },
  completed:{ type:Boolean, default:false },
});

const GoalSchema = new Schema({
  desk:{ type:Schema.Types.ObjectId, ref:'Desk', required:[true, 'DB: Desk required.'] },
  folder:{ type:Schema.Types.ObjectId, ref:'Folder', required:[true, 'DB: Folder required.'] },
  title:{ type:String, required:[true, 'DB: Title required.'], minLength:[1, 'DB: Title must be at least 1 characters.'], maxLength:[200, 'DB: Title must be at most 200 characters.'], trim:true },
  description:{ type:String, maxLength:[600, 'DB: Description must be at most 600 characters.'], trim:true },
  priority:{ type:String, enum:["Baja", "Media", "Alta"], default:"Media" },
  status:{ type:String, enum:["Pendiente", "En curso", "Finalizada"], default:"Pendiente" },
  dueDate:{ type:Date, required:[true, 'DB: Due date required.'] },
  assignedTo:[{ type:Schema.Types.ObjectId, ref:'User' }],
  createdBy:{ type:Schema.Types.ObjectId, ref:'User' },
  objectives:{ type:[objectiveSchema], required:true },
  progress:{ type:Number, default:0 },
}, { timestamps:true });

// delete models.Goal;

const GoalModel = models.Goal || model('Goal', GoalSchema);
export default GoalModel;