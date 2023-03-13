const mongoose = require("mongoose");

const blackListSchema = mongoose.Schema({
  btoken: { type: String },
});

const BlackListModel = mongoose.model("blackListedtoken", blackListSchema);

module.exports = { BlackListModel };
