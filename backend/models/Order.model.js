const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
      },
    ],
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true
    },
    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    billing_address: {
      type: String,
      // required: true
    },
    delivery: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: String,
      // required: true
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered","cancelled"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    price: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      // required: true
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "canceled"],
      default: "unpaid",
    },
    // paymentIntentId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
