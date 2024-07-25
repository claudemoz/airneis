const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: Object,
      path: String,
      url: String,
    },
    color: {
      type: String,
      require: true,
      default: "#6c5ce7"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
