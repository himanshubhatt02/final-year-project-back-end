const mongoose = require("mongoose")
const ChildSchema = new mongoose.Schema({
  blood_group: {
    type: String,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  pulse_rate: {
    type: String,
  },
  temprature: String,
  mother_name: String,
  father_name: String,
  email: {
    type: String,
    lowercase: true,
  },
  mobile: String,
  address: String,
  incubator_temperature: String,
  humidity: String,
  co2: String,
  o2: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
})
const Child = mongoose.model("Child", ChildSchema)
module.exports = Child
