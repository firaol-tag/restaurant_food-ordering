const db = require("../../config/db");
const { Chapa } = require("chapa-nodejs");
const { placeOrder, deletecart, verifyorders, getorders, allOrder } = require("./orders.service");
const axios=require("axios")
const requests=require("request")
module.exports = {
  PlaceOrder: async (req, res) => {
    const userId = req.id;
    const { address, items, amount } = req.body.orderData;
    // console.log(items)
    placeOrder({ userId, items, amount, address }, (err, result) => {
      if (err) return res.status(560).json({ success: false, msg: err });
      deletecart(userId, (err, result) => {
        if (err) return res.status(550).json({ success: false, msg: err });
        const sql = "SELECT id FROM orders WHERE user_id=? AND items=?";

        let line_items = items.map((item) => ({
          price_data: {
            product_name: item.name,
            amount: item.price,
          },
          quantity: item.quantity,
        }));
        line_items.push({
          price_data: {
            product_name: "delivery discharge",
            amount: 2,
          },
          quantity: 1,
        });
        db.query(sql, [userId, JSON.stringify(items)], async (err, result) => {
          if (err) {
            console.log(err);
            return res.status(600).json({ success: false, msg: err });
          }
          const chapa = new Chapa({
            secretKey: process.env.CHAPAKEY,
          });
          // const tx_ref = chapa.genTxRef();
          const tx_ref = await chapa.genTxRef({
            removePrefix: true, // defaults to `false`
            size: 20, // defaults to `15`
          });
          //  console.log(tx_ref)
          let orderId = result[0].id;

          var options = {
            method: "POST",
            url: "https://api.chapa.co/v1/transaction/initialize",
            headers: {
              Authorization: `Bearer ${process.env.CHAPAKEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              line_items: line_items,
              first_name: address.firstName,
              last_name: address.lastName,
              email: address.email,
              street: address.street,
              city: address.city,
              phone_number: address.phone,
              currency: "ETB",
              amount: amount,
              tx_ref: tx_ref,
              callback_url:
                "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
              return_url: `http://localhost:3000/verify?success=true&orderID=${orderId}`,
            }),
          };
          //     callback_url: `http://localhost:3000/verify?success=true$orderID=${orderId}`,
          //     cancel_url: `http://localhost:3000/verify?success=false$orderID=${orderId}`,
          //     // callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60/",
          //     // return_url: "https://example.com/",
          requests(options, function (error, response) {
            if (error)
              return res.status(601).json({ success: false, msg: error });
            console.log(response.body);
            const responsebody = JSON.parse(response.body);
            console.log(responsebody.data.checkout_url);
            return res.json(responsebody);
          });
        });
      });
    });
  },
  verifyPayment: (req, res) => {
    const { success, orderId } = req.body;
    const payment = true;
    console.log(req.body);
    if (success == "true") {
      verifyorders({ payment, orderId }, (err, result) => {
        if (err) {
          return res.status(346).json({ message: "error happens" });
        }
        return res.json({ success: true, message: "Paid" });
      });
    } else {
      const sql = "DELETE FROM orders WHERE id=?";
      db.query(sql, [orderId], (err, result) => {
        if (err) {
          return res.status(432).json({ message: "error happens" });
        }
        return res.json({ success: false, message: "not paid" });
      });
    }
  },
  getOrders: (req, res) => {
    const userId = req.id;
    // console.log(userId)
    getorders(userId, (err, result) => {
      if (err) {
        return res.status(699).json({ message: "successfuly fetched" });
      }
      return res.json({ data: result });
    });
  },
  getAllOrder: async (req, res) => {
    allOrder((err, result) => {
      if (err) {
        return res.status(850).json({ success: false, message: err });
      }
      return res.json({ success: true, data: result });
    });
  },
  changeStatus:(req,res)=>{
    const {status,id}=req.body
    console.log(status,id)
const sql = "UPDATE orders SET status=? WHERE id=?";
db.query(sql,[status,id],(err,result)=>{
if (err) {
  return res.status(850).json({ success: false, message: err });
}
return res.json({ success: true, data: result });
})
  }
};
