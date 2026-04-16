import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL!)
    .then(()=>{
        console.log("DB Connected");
    })
    .catch((err)=>{
        console.log("DB Connection Failed");
        console.log(err);
        process.exit(1);
    })
}