const User=require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt=require("bcryptjs");
const { BadRequestError, UnauthenticatedError } = require("../errors");


const register=async(req,res)=>{
   const user=await User.create({...req.body});
   const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
}

const login=async(req,res)=>{
   const {email,password}=req.body;

   if(!email || !password)
   {
    throw new BadRequestError("Please provide Email and Password");
   }

   const user=await User.findOne({email});
  
   if(!user)
   {
    throw new UnauthenticatedError("Invalid Credential");
   }
   const isPasswordCorrect=await user.comparePassword(password);
     
   if(!isPasswordCorrect)
   {
    throw new UnauthenticatedError("Invalid Credential");
   }

   const token=user.createJWT();
   res.status(StatusCodes.OK).json({user:{name:user.name},token});



//6490124465b96027008f5ac4
}


module.exports={register,login};