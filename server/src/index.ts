
declare global{
    namespace Express{
        export interface Request{
            userId:string
        }
    }
}

import express from "express";
import { dbConnect } from "./config/database.js";
import { User } from "./models/User.js";
import { Content } from "./models/Content.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { middleware } from "./middleware.js";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


dbConnect();



export enum resStatus{
    "NotFound" = 404,
    "Error" = 500,
    "Success" = 200
}

app.post("/signup", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
    
        if(!email || !password || !firstname || !lastname){
            return res.status(resStatus.NotFound).json({
                message:"Fill All Details"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const existUser = await User.findOne({
            email,
        })
        if(existUser){
            return res.status(resStatus.Error).json({
                message:"Account Already Exist"
            })
        }

        await User.create({
            email,
            password:hashPassword,
            firstname,
            lastname,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`
        })

    
        return res.status(resStatus.Success).json({
            message:"Account created"
        })
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message:"User Not Created!"
        })
    }
})


app.post("/signin", async(req, res)=>{
    try{
        const {email, password} = req.body;
    
        const user = await User.findOne({
            email,
        })
        if(!user){
            return res.status(resStatus.NotFound).json({
                message:"User not Exist"
            })
        }
        
        const verifyPass = await bcrypt.compare(password, user.password);

        if(!verifyPass){
            return res.status(resStatus.Error).json({
                message:"Password Incorrect"
            })
        }
    
        const token = jwt.sign({
            id:user._id,
        }, process.env.JWT_SECRET!, {
            expiresIn:30*60,
        });
    
        return res.status(resStatus.Success).json({
            message:"Login Success",
            token,
            email:user.email,
            firstname:user.firstname,
            lastname: user.lastname,
            avatar:user.image,
        })
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message:"Login failed"
        })
    }
})


app.post("/content", middleware, async(req, res)=>{
    try{
        const userId = req.userId;
        const {link, title, type} = req.body;
    
        if(!link || !title || !type){
            return res.status(resStatus.NotFound).json({
                message:"All Details required"
            })
        }
    
        const content = await Content.create({
            link,
            title,
            type,
            userId
        });
    
        return res.status(resStatus.Success).json({
            message:"Content Added"
        })
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message:"Content Not Added"
         })
    }
})


app.post("/allcontent", middleware, async(req, res)=>{
    try{
        const search = req.body.type?.trim();
        
        const data = await Content.find({
            userId: req.userId,
            ...(search && {
                $or : [
                    {type: { $regex:search, $options:"i" }},
                    {title: { $regex:search, $options:"i" }}
                ]
            })
        }).sort({createdAt:-1});        
    
        return res.status(resStatus.Success).json({
            message:"Fetched All data",
            data,
        })
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message:"Failed to get data"
         })
    }
})


app.post("/deleteContent", middleware, async(req, res)=>{
    try{
        const contentId = req.body.id;
    
        const data = await Content.findOneAndDelete({
            _id:contentId,
            userId:req.userId,
        })
    
        if(!data){
            return res.status(resStatus.NotFound).json({
                message:"Not able to delete"
            })
        }
    
        return res.status(resStatus.Success).json({
            message:"Content Deleted"
        });
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message:"Failed to delete content"
        })
    }
})


app.post("/profileUpdate", middleware, async(req, res)=>{
    try{
        const {
            firstname,
            lastname,
        } = req.body;

        if(!firstname?.trim() && !lastname?.trim()){
            return res.status(resStatus.NotFound).json({
                message:"Nothing Changed"
            })
        }

        const updatedFeilds = {
            ...(firstname && firstname),
            ...(lastname && lastname),
        }

        const user = await User.findByIdAndUpdate(
            {_id : req.userId},
            { $set: updatedFeilds},
            {returnDocument: "after"},
        ).select({
            firstname:1,
            lastname:1,
            image:1,
            email:1,
        })
    
        return res.status(resStatus.Success).json({
            message:"Profile Updated",
            user,
        })
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message:"Updation Failed",
        })
    }
})


app.post("/deleteAccount", middleware, async(req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const email = req.body.email;

        await Content.deleteMany(
            {userId: req.userId},
            {session}
        );

        const user = await User.findOneAndDelete(
            {
                _id : req.userId,
                email,
            }, 
            {session}
        );

        if(!user){
            await session.abortTransaction();
            session.endSession();

            return res.status(resStatus.NotFound).json({
                message:"User not found or email mismatch"
            })
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(resStatus.Success).json({
            message:"Your Account Deleted Successfully",
        })
    }
    catch(e){
        
        await session.abortTransaction();
        session.endSession();

        return res.status(resStatus.Error).json({
            message:"Failed to Delete your Account",
        })
    }
})


app.post("/changePassword", middleware, async(req, res)=>{
    try{
        const {
            oldPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if(newPassword !== confirmPassword){
            return res.status(resStatus.Error).json({
                message:"New & Confirm Password not matched"
            })
        }

        const user = await User.findById(req.userId);

        if(!user){
            return res.status(resStatus.NotFound).json({
                message:"User not found"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return res.status(resStatus.NotFound).json({
                message:"Old Password is Incorrect"
            })
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(resStatus.Error).json({
                message: "New password must be different",
            });
        }

        const newHashPass = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(
            req.userId, {
            password: newHashPass,
        });

        return res.status(resStatus.Success).json({
            message : "Password changed successfully"
        })
    }
    catch(e){
        return res.status(resStatus.Error).json({
            message: "Failed to change password"
        })
    }

})  



app.listen(3000, ()=>{
    console.log("server is up")
})

