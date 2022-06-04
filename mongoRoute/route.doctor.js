const express = require("express")
const router = express.Router()
const Child = require("../models/child.model")
const Doctor = require("../models/doctor.model")
const passport = require("passport")
const connctEnsure = require("connect-ensure-login")
const { body, validationResult } = require("express-validator")

//  imp: all get route
router.get("/", (req, res, next) => {
  console.log("printing user id from server")
  console.log(req.doctor) //getting loged in user data
  console.log(req.user) //getting loged in user data
  res.render("docDashboard")
})
router.get("/newchild", (req, res, next) => {
  const doctor = req.user
  res.render("newChild", { doctor })
})

router.get("/signup", async (req, res, next) => {
  res.render("doctor_signup") //for rendering doctor signup
})

router.get("/login", async (req, res, next) => {
  res.render("doctor_login") //for rendering doctor signup
})
router.get("/childrenlist", async (req, res, next) => {
  const doctorData = await Doctor.findById(req.user.id).populate(
    "childrenAdded"
  )
  res.render("childrenList", { doctorData }) //for rendering doctor signup
})

//doctor post

//  imp: all post route
// note:  new child
router.post("/newchild", async (req, res, next) => {
  try {
    const child = new Child(req.body)
    const { id: newChildId } = await child.save()
    await Doctor.findByIdAndUpdate(req.user.id, {
      $push: { childrenAdded: newChildId },
    })

    const AddedChildren = await Doctor.findById(req.user.id).populate(
      "childrenAdded"
    )
    res.send(AddedChildren)

    // res.send(`<h1>Added child data succesfully</h1><br>
    // ${child}

    // `)
    // res.send(child)
  } catch (error) {
    next(error)
  }
})
//  note:  signup route
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
      const doesExist = await Doctor.findOne({ email })
      if (doesExist) {
        console.log("email already exists")
        res.redirect("/doctor/signup/")
        return
      }
      const doctor = new Doctor(req.body)
      await doctor.save()
      // req.flash("Succes", `${doctor.email} registered succesfull you may login`)
      res.redirect("/doctor/login")
      // res.send(user)
    } catch (error) {
      next(error)
    }
  }
)
// note:  doctor login route
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
