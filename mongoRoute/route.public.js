const express = require("express")
const router = express.Router()
const mongoose=require("mongoose")
router.get("/", (req, res, next) => {
  res.render("index")
})
router.get("/vaccine", async (req, res, next) => {
  res.render("vaccine") //for rendering doctor signup
})
router.get("/aboutvaccine", async (req, res, next) => {
  res.render("aboutvaccine") //for rendering doctor signup
})
router.get("/diagnosis1", async (req, res, next) => {
  res.render("diagnosis1") //for rendering doctor signup
})


module.exports = router
