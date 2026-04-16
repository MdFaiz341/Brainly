import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    link:String,
    title:String,
    type:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


export const Content = mongoose.model("Content", contentSchema);

