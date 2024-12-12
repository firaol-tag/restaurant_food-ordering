const db = require("../../config/db");

module.exports = {
  createUser:(data,callback)=>{
    const value=[data.name,data.email,data.password]
    console.log(value)
    const sql =
      "INSERT INTO user(name, email, password) VALUES(?)";
    db.query(sql, [value], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
  userByEmail:(email,callback)=>{
    console.log(email)
    db.query("SELECT * FROM user WHERE email=?", [email], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result[0]);
    });
  }
};