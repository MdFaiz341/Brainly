import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";


export const middleware = (req:Request, res:Response, next:NextFunction)=>{
    try{
        const token = req.headers.token;
    
        const decodeJwt = jwt.verify(token as string, process.env.JWT_SECRET!);
    
        req.userId = (decodeJwt as JwtPayload).id;
        next();
    }
    catch(e){
        return res.status(401).json({
            message: "Token expired"
        });
    }
}