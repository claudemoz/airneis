const mongoose = require("mongoose");

const materialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: false,
      default: null
    },
    color: {
      type: String,
      require: true,
      default: "#0984e3"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
