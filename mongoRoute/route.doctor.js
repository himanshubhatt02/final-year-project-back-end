const express = require("express")
const router = express.Router()
const Child = require("../models/child.model")
const Doctor = require("../models/doctor.model")
const Parent = require("../models/parent.model")
const passport = require("passport")
const mongoose = require("mongoose")
const connctEnsure = require("connect-ensure-login")
const { body, validationResult } = require("express-validator")

//  imp: all get route
router.get("/", (req, res, next) => {
  console.log("printing user id from server")
  console.log(req.doctor) //getting loged in user data
  console.log(req.user) //getting loged in user data
  console.log(req.parent) //getting loged in user data
  totalchildren = req.user.childrenAdded.length
  console.log(totalchildren)
  res.render("docDashboard", { totalchildren })
})
router.get("/newchild", (req, res, next) => {
  const doctor = req.user
  console.log("inside new child route")
  console.log(typeof doctor, doctor)
  res.render("newChild", doctor) //note: sending doctor obj directly
})

router.get("/signup", async (req, res, next) => {
  res.render("doctor_signup") //for rendering doctor signup
})

router.get("/login", async (req, res, next) => {
  res.render("doctor_login") //for rendering doctor signup
})
router.get("/childrenlist", async (req, res, next) => {
  console.log(req.user._id)
  const doctorData = await Doctor.findById(req.user._id).populate(
    "childrenAdded"
  )
  console.log("getting all data")
  console.log(doctorData)
  res.render("childrenList", doctorData) //for rendering doctor signup
})
router.get("/child/:id", async (req, res, next) => {
  try {
    const { id } = req.params //now we need to validate if its a valid id for the we import
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "invalid id")
      res.redirect("/admin/users")
      return
    }
    const childData = await Child.findById(id)
    res.render("childProfile", { childData }) //render profile of that child
  } catch (error) {
    next(error)
  }
})

router.get("/getparentinfo/:email", async (req, res, next) => {
  try {
    // console.log("getting parent info")
    // res.send(req.user.foodConsumed)
    console.log("got parent email from " + req.params.email)
    // res.send()
    const parent = await Parent.findOne({ email: req.params.email }).exec()
    console.log(parent)
    res.send(parent)
  } catch (e) {
    console.log("some error while sending data")
    console.log(e)
  }
})

//doctor post

//  imp: all post route
// note:  new child

router.post("/newchild", async (req, res, next) => {
  try {
    console.log("printing request")
    console.log(req.body)
    const child = new Child(req.body)
    const { id: newChildId } = await child.save()
    console.log("sending data into doctor")
    await Doctor.findByIdAndUpdate(req.user._id, {
      $push: { childrenAdded: newChildId },
    })
    console.log("sending data into parent")
    await Parent.findByIdAndUpdate(req.body.parent_id, {
      $push: { children: newChildId },
    })

    const AddedChildren = await Doctor.findById(req.user._id).populate(
      "childrenAdded"
    )
    res.redirect("/doctor/childrenlist")

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
router.get("/vaccine", async (req, res, next) => {
  res.render("vaccine") //for rendering doctor signup
})
module.exports = router
