const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const Doctor = require("../models/doctor.model")

passport.use(
  "doctorLoginMiddleware",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log("inside middle ware")
        const doctor = await Doctor.findOne({ email }) //mongodb command
        // Username/email does NOT exist
        if (!doctor) {
          console.log("doctor not found")
          return done(null, false, {
            message: "Username/email not registered",
          })
        }
        console.log("doctor with email exists")
        // Email exist and now we need to verify the password
        const isMatch = await doctor.isValidPassword(password)
        if (isMatch) {
          console.log("password matched")
          return done(null, doctor)
        } else {
          console.log("pass doesnt match " + typeof password + password)
          return done(null, false, { message: "Incorrect password" })
        }
      } catch (error) {
        done(error)
      }
    }
  )
)
//session + cookie automatically for traferring user details if succesfull by decrypting it
passport.serializeUser(function (doctor, done) {
  console.log(doctor.id)
  done(null, doctor.id)
})

passport.deserializeUser(function (id, done) {
  Doctor.findById(id, function (err, user) {
    done(err, user)
  })
})
