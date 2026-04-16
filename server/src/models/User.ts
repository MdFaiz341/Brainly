import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    }
});

export const User = mongoose.model("User", UserSchema);
