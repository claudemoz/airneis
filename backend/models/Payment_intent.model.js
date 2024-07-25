const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const {hash} = require('bcrypt');

const payment_intentSchema = mongoose.Schema(
    {
      entire_name: {
        type: String,
        require: true,
        trim: true,
      },
      
      expiration_date: {
        type: Date,
        require: true,
        trim: true,
      },
      

      last4: { 
        type: String, 
        required: true 
      },

      brand: { 
        type: String, 
        required: true 
      },

      userId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
  
      Verified: {
        type: Boolean,
        default: false,
      },

      // token: String
    }
)

payment_intentModel = mongoose.model('Payment_intent', payment_intentSchema)
module.exports = payment_intentModel