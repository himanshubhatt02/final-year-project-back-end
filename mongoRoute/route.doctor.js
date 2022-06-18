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
router.get("/", async (req, res, next) => {
  console.log("printing user id from server")
  //getting loged in user data
  console.log(req.user) //getting loged in user data
  //getting loged in user data

  allChildrenCount = await Child.countDocuments({})
  const { childrenAdded: childrenUAdded } = await Doctor.findById(req.user._id)
  console.log(`total children ${allChildrenCount}`)
  console.log(`total children u added ${childrenUAdded.length}`)

  doctorData = {
    allChildrenCount: allChildrenCount,
    childrenUAdded: childrenUAdded.length,
  }
  res.render("docDashboard", doctorData)
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
router.get("/diagnosis1", async (req, res, next) => {
  res.render("diagnosis1") //for rendering doctor signup
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

router.get("/allchildren", async (req, res, next) => {
  console.log(req.user._id)
  const children = await Child.find({})
  console.log("getting all data")
  console.log(children)
  res.render("allChildren", { children }) //for rendering doctor signup
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
router.get("/vaccine", async (req, res, next) => {
  res.render("vaccine") //for rendering doctor signup
})
router.get("/vaccine1", async (req, res, next) => {
  res.render("vaccine1") //for rendering doctor signup
})
router.get("/diagnosis/:id", async (req, res, next) => {
  // res.send(req.params.id)
  const { diagnosis } = await Child.findById(
    req.params.id,
    "-_id diagnosis"
  ).exec()
  console.log(diagnosis)
  res.render("diagnosis", { _id: req.params.id, diagnosis }) //for rendering doctor signup
})
router.get("/vaccineprofile/:id", async (req, res, next) => {
  console.log(req.params.id)
  // res.send(req.params.id)
  const { vaccine } = await Child.findById(req.params.id, "-_id vaccine").exec()
  // console.log(vaccine)
  vaccine.influenza = [vaccine.influenza]
  vaccine.mmr = [vaccine.mmr]
  vaccine.var = [vaccine.var]
  // res.render("vaccineprofile", { vaccine }) //for rendering doctor signup
  let editedVaccine = vaccine
  //note: above code is working
  for (var key in vaccine) {
    if (Array.isArray(vaccine[key])) {
      // for (i = 0; i < vaccine[key].length; i++) {
      for (let i = 0; i < vaccine[key].length; i++) {
        // console.log(vaccine[key][i])
        if (vaccine[key][i] == "one") {
          vaccine[key][i] = "pending"
        }
        if (vaccine[key][i] == "two") {
          vaccine[key][i] = "due"
        }
        if (vaccine[key][i] == "three") {
          vaccine[key][i] = "overDue"
        }
        console.log(vaccine[key][i])
      }
    }
  }
  console.log(vaccine)
  res.render("vaccineprofile", { vaccine })
})
// note: logout
router.get("/logout", async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
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
    // res.redirect("/doctor/childrenlist")
    res.render("vaccine", { _id: newChildId })
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
router.post("/vaccine", async (req, res, next) => {
  try {
    console.log(req.body)
    console.log(req.body._id)
    // const newChildWithVaccine = await Child.findOneAndUpdate(
    //   { _id: req.body._id },
    //   { vaccine: req.body }
    // )

    Child.updateOne(
      { _id: req.body._id },
      { vaccine: req.body },
      { multi: true },
      function (err, numberAffected) {}
    )
    res.redirect("/doctor/childrenlist")
    // res.send(req.body) //for rendering doctor signup\
  } catch (error) {
    console.log(error)
  }
})

router.post("/adddiagnosis/:id", async (req, res, next) => {
  console.log(req.body)

  res.send(req.body)
  await Child.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { diagnosis: req.body } }
  )
  console.log("data pushed succesfully")
})

module.exports = router
