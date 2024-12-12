// const foodModel = require("./../../model/foodModel");
const db = require("./../../config/db");
const fs = require("fs");
const { Addfood, ListFood, DeleteFood } = require("./food.service");
module.exports = {
  addFood: (req, res) => {
    const imageFilename = req.files["image"][0].filename;
    const image = `/upload/${imageFilename}`;
    const { name, description, price, category } = req.body;
    console.log(name, description, price, category);
    console.log(image)
    Addfood({ name, description, price, image, category }, (err, result) => {
      if (err) return res.status(432).json({ success: false, message: err });
      return res.json({ success: true, message: "food added" });
    });
  },
  listFood: (req, res) => {
    ListFood((err, result) => {
      if (err) return res.status(432).json({ success: false, message: err });
      // console.log(result);
      res.json({ success: true, message: "food fetched", data: result });
    });
  },
  deleteFood:(req,res)=>{
    const id=req.params.id
    const sql = "DELETE FROM foods WHERE id=?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(442).json({ success: false, message: err });
      res.json({ success: true, message: "successfully deleted", data: result });
      // fs.unlink(`upload/${food.image}`,()=>{})
    });
  }
};
