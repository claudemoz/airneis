const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require("bcrypt");

const passwordResetTokenSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true, 
    unique: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, // Expire le document 60 secondes après sa création et sera automatiquement supprimé
    default: Date.now,
  },
});

passwordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);