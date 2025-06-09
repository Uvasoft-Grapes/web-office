import { Schema, model, models } from 'mongoose';

const recurrenceSchema = new Schema({
  frequency:{ type:String, enum:["daily", "weekly", "monthly", "yearly"], },
  endFrequency:{ type:Date },
});

const EventSchema = new Schema(
  {
    desk:{ type:Schema.Types.ObjectId, ref:"Desk", required:[true, "DB: Desk required."] },
    folder:{ type:Schema.Types.ObjectId, ref:"Folder", required:[true, "DB: Folder required."] },
    title:{ type:String, required:[true, 'DB: Title required.'], minLength:[1, 'DB: Title must be at least 1 characters.'], maxLength:[200, 'DB: Title must be at most 200 characters.'], trim:true },
    description:{ type:String, maxLength:[600, 'DB: Title must be at most 600 characters.'], trim:true },
    startDate:{ type:Date, required:true },
    endDate:{ type:Date, required:true },
    createdBy:{ type:Schema.Types.ObjectId, ref:"User", required:true },
    assignedTo:[{ type:Schema.Types.ObjectId, ref:"User" }],
    recurrence:{ type:recurrenceSchema, default:undefined },
  },
  { timestamps: true }
);

delete models.Event;

const EventModel = models.Event || model('Event', EventSchema);
export default EventModel;