const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        index: Number,
        path: String,
        url: String,
      },
    ],
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },

    materials: [
      {
        type: Schema.Types.ObjectId,
        ref: "Material",
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
