const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    trim: true,
  },
  objet: {
    type: String,
    require: true,
    trim: true,
  },
  message: {
    type: String,
    require: true,
    trim: true,
  },
},{ timestamps: true });
module.exports = mongoose.model("Contact", contactSchema);
