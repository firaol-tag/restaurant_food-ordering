const express = require("express");
const { addFood, listFood, deleteFood } = require("./food.controller");
const foodRouter = express.Router();
foodRouter.post("/add",addFood);
foodRouter.get("/list",listFood);
foodRouter.delete("/delete/:id",deleteFood);
module.exports = foodRouter;
