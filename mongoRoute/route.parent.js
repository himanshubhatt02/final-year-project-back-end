const express = require("express")
const router = express.Router()
const Child = require("../models/child.model")
const Parent = require("../models/parent.model")
const passport = require("passport")
const mongoose = require("mongoose")
const connctEnsure = require("connect-ensure-login")
const { body, validationResult } = require("express-validator")

//  imp: all get route
router.get("/signup", async (req, res, next) => {
  res.render("parent_signup") //for rendering Parent signup
})

// imp: all post route
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be a valid email")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(2)
      .withMessage("password must be min  2 character"),
    body("re_pass").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password do not match")
      }
      return true
    }),
  ],
  async (req, res, next) => {
    try {
      // const errors = validationResult(req)
      // if (!errors.isEmpty()) {
      //   errors.array().forEach((error) => {
      //     req.flash("error", error.msg)
      //   })
      //   res.render("doctorSignup", {
      //     email: req.body.email,
      //     messages: req.flash(),
      //   })
      //   return
      // }
      const { email } = req.body
      const doesExist = await Parent.findOne({ email })
      if (doesExist) {
        console.log("email already exists")
        res.redirect("/parent/signup/")
        return
      }
      const parent = new Parent(req.body)
      await parent.save()
      // req.flash("Succes", `${doctor.email} registered succesfull you may login`)
      res.redirect("/parent/login")
      // res.send(user)
    } catch (error) {
      next(error)
    }
  }
)
module.exports = router
