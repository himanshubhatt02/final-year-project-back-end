const mongoose = require("mongoose")
const Child = require("../models/child.model")
const createHttpError = require("http-errors")

const DoctorSchema = new mongoose.Schema({
  username: {
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

  childrenAdded: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Child,
    },
  ],
})
DoctorSchema.methods.isValidPassword = async function (password) {
  if (password === this.password) {
    console.log(this.password + "coming from server")
    return true
  }
  return false
}

const Doctor = mongoose.model("Doctor", DoctorSchema)
module.exports = Doctor
