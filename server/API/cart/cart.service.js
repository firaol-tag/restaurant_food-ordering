const db=require("../../config/db")
module.exports = {
  addcart: ({ userId, itemId, cartamount }, callback) => {
    // console.log(cartamount);
    const sql = "INSERT INTO cart(user_id,item_id,cart_mount) VALUES(?,?,?)";
    db.query(sql, [userId, itemId, cartamount], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
  addtocart: ({ userId, itemId, cartamount }, callback) => {
    // console.log(userId, itemId, cartamount);
    const sql = "UPDATE cart SET cart_mount=? WHERE user_id=? AND item_id=?";
    db.query(sql, [cartamount, userId, itemId], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
  removefromCart: ({ userId, itemId, cart }, callback) => {
    console.log(userId, itemId, cart);
    const sql = "UPDATE cart SET cart_mount=? WHERE user_id=? AND item_id=?";
    db.query(sql, [cart, userId, itemId], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
  getcart: (userId, callback) => {
    const sql = "SELECT * FROM cart WHERE user_id=?";
    db.query(sql, [userId], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
  deletefromcart: ({ userId, itemId }, callback) => {
    const sql = "DELETE FROM cart WHERE user_id=? AND item_id=?";
    db.query(sql, [userId, itemId], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
};
