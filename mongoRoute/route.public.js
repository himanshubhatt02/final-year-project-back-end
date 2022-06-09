const express = require("express")
const router = express.Router()
const Child = require("../models/child.model")
const Doctor = require("../models/doctor.model")
const Parent = require("../models/parent.model")
const passport = require("passport")
const mongoose = require("mongoose")
const connctEnsure = require("connect-ensure-login")
const { body, validationResult } = require("express-validator")

router.get("/", (req, res, next) => {
  res.render("index")
})
router.get("/vaccine", async (req, res, next) => {
  res.render("vaccine") //for rendering doctor signup
})
router.get("/aboutvaccine", async (req, res, next) => {
  res.render("aboutvaccine") //for rendering doctor signup
})
router.get(
  "/login",
  connctEnsure.ensureLoggedOut({ redirectTo: "/doctor" }),
  async (req, res, next) => {
    res.render("doctor_login") //for rendering doctor signup
  }
)
router.get(
  "/signup",
  connctEnsure.ensureLoggedOut({ redirectTo: "/doctor" }),
  async (req, res, next) => {
    res.render("doctor_signup") //for rendering doctor signup
  }
)
// note: logout
router.get("/logout", async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
})

//  imp: all post
router.post(
  "/login",

  passport.authenticate("doctorLoginMiddleware", {
    // successRedirect: "/user/profile", //original
    successReturnToOrRedirect: "/doctor", //original

    failureRedirect: "/doctor/login",
    failureFlash: true,
  })
)

module.exports = router

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("back")
  } else {
    next()
  }
}
