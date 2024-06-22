import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"



export const verifyJWT = asyncHandler( async (req , res, next)=>{
      try {
         const token  =   req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        //  console.log(req.cookies.accessToken);
         if(!token) {
          throw new ApiError(401,"unauthorized")
         }
         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,)
        //  console.log(decodedToken);
         const user  = await User.findById(decodedToken?._id).select("-refreshToken");
         if(!user){
          throw new ApiError(401 ,"Invalid token")
         }
         req.user = user;
         next();
      } catch (error) {
        throw new ApiError(401,error?.message||"inalid Access Token")
      }


})