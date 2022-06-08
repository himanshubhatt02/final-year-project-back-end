const express = require("express")
const router = express.Router()
const Child = require("../models/child.model")
const Parent = require("../models/parent.model")
const passport = require("passport")
const mongoose = require("mongoose")
const connctEnsure = require("connect-ensure-login")
const { body, validationResult } = require("express-validator")

//  imp: all get route
router.get("/", async (req, res, next) => {
  console.log(req.user)
  res.render("parent_dashboard", req.user) //for rendering Parent signup
})
router.get("/signup", async (req, res, next) => {
  res.render("parent_signup") //for rendering Parent signup
})
router.get("/login", async (req, res, next) => {
  res.render("parent_login") //for rendering doctor signup
})
router.get("/children", async (req, res, next) => {
  console.log(req.user._id)
  const parentData = await Parent.findById(req.user._id).populate("children")
  console.log("getting all data")
  console.log(parentData)
  res.render("myChild", parentData)
  // res.render("children", parentData) //for rendering doctor signup
  // res.send(parentData)
})
router.get("/diet", async (req, res, next) => {
  res.render("diet") //for rendering doctor signup
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

router.post(
  "/login",
  passport.authenticate("parentLoginMiddleware", {
    // successRedirect: "/user/profile", //original
    successReturnToOrRedirect: "/parent", //original

    failureRedirect: "/parent/login",
    failureFlash: true,
  })
)
module.exports = router
