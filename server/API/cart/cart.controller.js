const db = require("./../../config/db");
const {
  addtocart,
  addcart,
  removefromCart,
  deletefromcart,
  getcart,
} = require("./cart.service");

module.exports = {
  addToCart: (req, res) => {
    const userId = req.id;
    const itemId = req.body.itemId;
    let cartamount = 0;
    // console.log(userId,itemId)
    const sql = "SELECT cart_mount FROM cart WHERE user_id=? AND item_id=?";
    db.query(sql, [userId, itemId], (err, result) => {
      if (err) {
        return res.status(430).json({ success: false, message: err });
      }
      if (result.length === 0) {
        cartamount = 1;
        addcart({ userId, itemId, cartamount }, (err, result) => {
          if (err) {
            return res.status(450).json({ success: false, message: err });
          }
          return res.json({ success: true, message: "item added to cart" });
        });
      } else {
        let cartamount = result[0].cart_mount;
        cartamount += 1;
        addtocart({ userId, itemId, cartamount }, (err, result) => {
          if (err) {
            return res.status(460).json({ success: false, message: err });
          }
          return res.json({ success: true, message: "item added to cart" });
        });
      }
      // console.log(cartamount)
    });
  },
  removeFromCart: (req, res) => {
    const userId = req.id;
    const itemId = req.body.itemId;
    const sql = "SELECT cart_mount FROM cart WHERE user_id=? AND item_id=?";
    db.query(sql, [userId, itemId], (err, result) => {
      let cart = result[0].cart_mount;
      console.log(cart);
      if (err) {
        return res.status(430).json({ success: false, message: err });
      }
      if (result.length > 0) {
        cart -= 1;
        console.log(result);
        removefromCart({ userId, itemId, cart }, (err, result) => {
          if (err) {
            return res.status(450).json({ success: false, message: err });
          }
          return res.json({ success: true, message: "item removed from cart" });
        });
      } 
      // else if (cart === 1) {
      //   const sql = "DELETE FROM cart WHERE user_id=? AND item_id";
      //   db.query(sql, [userId, itemId], (err, result) => {
      //     if (err) {
      //       return res.status(450).json({ success: false, message: err });
      //     }
      //     return res.json({ success: true, message: "item deleted from cart" });
      //   });
      // } 
      // else{
      //   console.log("error happens")
      // }
    });
  },
  getCart: (req, res) => {
    const userId = req.id;
    getcart(userId, (err, result) => {
      if (err) {
        return res.status(450).json({ success: false, message: err });
      }
      return res.json({ success: true, message: "item in the cart fetched successfully",data:result });
    });
  },
};
