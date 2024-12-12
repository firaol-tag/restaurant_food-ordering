const { addToCart, removeFromCart, getCart } = require("./cart.controller")
const Auth=require("./../../middleware/auth")
const cartRouter=require("express").Router()
cartRouter.put("/addtocart",Auth,addToCart)
cartRouter.put("/removefromcart",Auth,removeFromCart)
cartRouter.post("/getcart",Auth,getCart)
module.exports=cartRouter