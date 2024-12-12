const { PlaceOrder, verifyPayment, getOrders, getAllOrder, changeStatus } = require("./orders.controller");
const orderRouter = require("express").Router();
const Auth = require("./../../middleware/auth");
orderRouter.post("/placeorder", Auth, PlaceOrder);
orderRouter.put("/verifypayment", verifyPayment);
orderRouter.post("/getorders", Auth, getOrders);
orderRouter.get("/allorders",getAllOrder)
orderRouter.put("/status",changeStatus)
module.exports = orderRouter;
