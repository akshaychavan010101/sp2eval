const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
});

const ProductsModel = mongoose.model("evalproduct", productSchema);

module.exports = { ProductsModel };
