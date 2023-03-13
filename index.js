const express = require("express");
const connection = require("./config/db");
const { ProductsRouter } = require("./routes/products.routes");
const { UserRouter } = require("./routes/users.routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use(UserRouter)
app.use(ProductsRouter)


app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Running and Connected to DB");
  } catch (error) {
    console.log(error);
  }
});
