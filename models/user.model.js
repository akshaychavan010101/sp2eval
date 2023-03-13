const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "seller"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    const hashed = bcrypt.hashSync(this.password, 5);
    this.password = hashed;
    next();
  } catch (error) {
    console.log(error);
  }
});

const UserModel = mongoose.model("evaluser", userSchema);

module.exports = {UserModel};
