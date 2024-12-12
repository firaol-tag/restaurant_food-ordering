const express = require("express");
const { userLogin, userRegistration } = require("./user.controller");
const userRouter=express.Router()
userRouter.post("/login",userLogin)
userRouter.post("/register",userRegistration)
module.exports=userRouter