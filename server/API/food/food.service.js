const db = require("./../../config/db");
module.exports = {
  Addfood: (data, callback) => {
    const sql =
      "INSERT INTO foods(name,description,price,image,category) VALUES(?)";
      const value=[data.name, data.description, data.price, data.image, data.category]
    db.query(sql, [value], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
  ListFood: (callback) => {
    const sql = "SELECT * FROM foods";
    db.query(sql, (err, result) => {
      if (err) callback(err);
      callback(null, result);
    });
  },
  DeleteFood:(data,callback)=>{
    const sql="DELETE FROM foods WHERE id=?"
    const id=data.id
     db.query(sql,id, (err, result) => {
       if (err) callback(err);
       callback(null, result);
     });
  }
};