var mongoose = require("mongoose");

var ZipSchema = mongoose.Schema({
  zipcode: Number
});

var Zipcode = mongoose.model("Zipcode", ZipSchema);

module.exports = Zipcode;