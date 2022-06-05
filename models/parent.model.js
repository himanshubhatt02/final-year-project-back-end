const mongoose = require("mongoose")
const Child = require("../models/child.model")
const createHttpError = require("http-errors")

const ParentSchema = new mongoose.Schema({
  mother_name: {
    type: String,
    required: true,
    lowercase: true,
  },
  father_name: {
    type: String,
    required: true,
    lowercase: true,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  children: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Child,
    },
  ],
})
ParentSchema.methods.isValidPassword = async function (password) {
  if (password === this.password) {
    console.log(this.password + "coming from server")
    return true
  }
  return false
}

const Parent = mongoose.model("Parent", ParentSchema)
module.exports = Parent
