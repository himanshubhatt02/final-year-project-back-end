const express = require("express")
const router = express.Router()
router.get("/", (req, res, next) => {
  res.render("index")
})
router.get("/aboutvaccine", async (req, res, next) => {
  res.render("aboutvaccine") //for rendering doctor signup
})

module.exports = router
