const mongoose = require('mongoose')
const {hash, compare} = require('bcrypt');

const userSchema = mongoose.Schema(
    {
      firstname: {
        type: String,
        require: true,
        trim: true,
      },
      lastname: {
        type: String,
        require: true,
        trim: true,
      },
      email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
      },
      password: {
        type: String,
        require: true,
        trim: true,
      },
  
      Verified: {
        type: Boolean,
        default: false,
      },
      photo: {
        type: Object,
        url: String,
        path: String,
      },
      roles:{
        type: [String],
        enum : ['customer','admin', 'superAdmin'],
        default: 'customer'
      },
      // isActive est utilisé uniquement pour les admins
      isActive:{
        type: Boolean,
        default: false,
      }, 
      // token: String
    },{ timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});
  
userSchema.methods.comparePassword = async function (password) {
  console.log("password ", password);
  console.log("this.password ", this.password);
  return await compare(password, this.password);
};

userModel = mongoose.model('User', userSchema)
module.exports = userModel