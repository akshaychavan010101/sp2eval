const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../models/blacklistedToken");
const { authentication } = require("../middlewares/authentication");

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) return res.status(200).send({ msg: "User already existx, Please Login" });
    else {
      const newUser = new UserModel(req.body);
      await newUser.save();

      res.status(201).send({ msg: "Registered Successfuly" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error", Error: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ msg: "Cannot find user, Please SingUp" });
    else {
      await bcrypt.compare(password, user.password, (err, result) => {
        if (err)
          return res.status(404).send({ msg: "Invalid Password", Error: err.message });
        else {
          const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: 60,
          });

          const refreshtoken = jwt.sign(
            { user },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: 300 }
          );

          res.status(200).send({ msg: "Login Successfull", token, refreshtoken, user });
        }
      });
    }
  } catch (error) {
    res.send({ msg: "Server Error", Error: error.message });
  }
});

UserRouter.get("/refresh", async (req, res) => {
  try {
    const refreshtoken = req.headers.authorization;
    if (!refreshtoken) return res.status(200).send({ msg: "Please login" });
    await jwt.verify(
      refreshtoken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(200).send({ msg: "Please Login again", Error: err.message });
        else {
          const user = decoded.user;
          const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: 60,
          });
          res.status(200).send({ msg: "Login Successfull", token, user });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ msg: "Server Error", Error: error.message });
  }
});

UserRouter.get("/logout", authentication, async (req, res) => {
  try {
    const token = req.headers.authorization;
    await BlackListModel({ btoken: token }).save();
    res.status(200).send({ msg: "Logout successful" });
  } catch (error) {
    res.status(500).send({ msg: "Server error", Error: error.message });
  }
});

module.exports = { UserRouter };
