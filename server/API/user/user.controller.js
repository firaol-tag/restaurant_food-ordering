const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const db = require("../../config/db");
const { createUser, userByEmail } = require("./user.service");
module.exports = {
  userLogin: (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("please fill all information");
      res
        .status(305)
        .json({ success: false, msg: "please fill all information" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(250)
        .json({ success: false, msg: "please enter correct email" });
    }
    userByEmail(email, (err, result) => {
      if (err) {
        console.log("error occur");
        return res.status(200).json({ success: false, msg: "error occur" });
      }
      if (!result) {
        console.log("user not found");
        return res.status(420).json({ success: false, msg: "user not found" });
      }
      console.log(result.password);
      console.log(password);

      const ismatch = bcrypt.compareSync(password, result.password);
      if (!ismatch) {
        console.log("incorrect password");
        return res
          .status(450)
          .json({ success: false, msg: "incorrect password" });
      }
      const token = jwt.sign({ id: result.id }, "jwtkey");
      return res.json({
        token,
        user: {
          name: result.name,
          email: result.email,
        },
      });
    });
  },
  userRegistration: (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("please fill all info");
      return res
        .status(350)
        .json({ success: false, msg: "please fill all info" });
    }
    if (password.length < 6) {
      console.log("password must be greater than 6");
      return res
        .status(400)
        .json({ success: false, msg: "password must be greater than 6" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(250)
        .json({ success: false, msg: "please enter correct email" });
    }
    db.query("SELECT * FROM user WHERE email=?", [email], (err, result) => {
      if (err)
        return res.status(250).json({ success: false, msg: "error occured" });
      if (result.length > 0) {
        console.log("user already exist");
        return res
          .status(410)
          .json({ success: false, msg: "user already exist" });
      } else {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(password, salt);

        createUser(req.body, (err, results) => {
          if (err) return res.status(300).json({ success: false, msg: err });
          console.log(results);
          //  res.json({ success: true, msg: "successfuly registered" });
          userByEmail(email, (err, result) => {
            if (err) {
              console.log("error occur");
              return res
                .status(200)
                .json({ success: false, msg: "error occur" });
            }
            if (!result) {
              console.log("user not found");
              return res
                .status(420)
                .json({ success: false, msg: "user not found" });
            }
            console.log(result.password);
            console.log(password);

            const ismatch = bcrypt.compareSync(password, result.password);
            if (!ismatch) {
              console.log("incorrect password");
              return res
                .status(450)
                .json({ success: false, msg: "incorrect password" });
            }
            const token = jwt.sign({ id: result.id }, "jwtkey");
            return res.json({
              token,
              user: {
                name: result.name,
                email: result.email,
              },
            });
          });

        });
      }
    });
  },
};
