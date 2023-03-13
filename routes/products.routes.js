const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authentication } = require("../middlewares/authentication");
const { ProductsModel } = require("../models/products.model");
const { authorization } = require("../middlewares/authorization");
const ProductsRouter = express.Router();

ProductsRouter.get("/products", authentication, async (req, res) => {
  try {
    const products = await ProductsModel.find({});
    res.status(200).send({ Products: products });
  } catch (error) {
    res.status(500).send({ msg: "Server Error", Error: error.message });
  }
});

ProductsRouter.post(
  "/addproducts",
  authentication,
  authorization(["seller"]),
  async (req, res) => {
    try {
      const { title, desc, price } = req.body;
      await ProductsModel({ title, desc, price }).save();
      res.status(201).send({ msg: "Product Added Successfuly" });
    } catch (error) {
      res.status(500).send({ msg: "Server Error", Error: error.message });
    }
  }
);

ProductsRouter.delete(
  "/deleteproducts/:id",
  authentication,
  authorization(["seller"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const product = await ProductsModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: "Product Deleted successfuly" });
    } catch (error) {
      res.status(500).send({ msg: "Server error", Error: error.message });
    }
  }
);
module.exports = { ProductsRouter };
