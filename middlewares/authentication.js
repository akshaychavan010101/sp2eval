const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../models/blacklistedToken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const btoken = await BlackListModel.findOne({ btoken: token });
    if (btoken) return res.send({ msg: "Please Login again" });
    if (!token) return res.send({ msg: "Please Login First" });
    else {
      await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          res.send({ msg: "Error", Error: err.message });
        } else {
          req.body.user = decoded.user;
          next();
        }
      });
    }
  } catch (error) {
    res.send({ msg: "Server error", Error: error.message });
  }
};

module.exports = { authentication };
