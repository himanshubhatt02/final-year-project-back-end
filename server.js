const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const createHttpError = require("http-errors")
const helmet = require("helmet")
const mongoose = require("mongoose")
var mysql = require("mysql2")
const connectFlash = require("connect-flash")
const path = require("path")

const mongoStore = require("connect-mongo")
const session = require("express-session")
const passport = require("passport")
const connectEnsureLogin = require("connect-ensure-login")

const app = express()

// importing dot env
require("dotenv/config")

//initializing api
//which is the initial route of api
const api = process.env.API_URL
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
})
//CORS
app.use(cors())
app.options("*", cors())
app.set("view engine", "ejs")

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy-Report-Only",
    "default-src 'self'; font-src 'self'; img-src 'self' 'unsafe-inline'; script-src * 'unsafe-inline' http://localhost:3000/js/diet.js 'unsafe-hashes'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ; frame-src 'self'"
  )
  next()
})

// Middlewares
// Middleware to serve static files
// app.use(express.static("views")) // note:  if all static files are present in views
app.use(express.static("public")) //note:  if static  files are present in public fo
// app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("tiny"))
//Always use helmet for safety
app.use(helmet())
app.use(express.json())

//Mysqldb  connection

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "child_care",
})

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack)
    return
  }

  console.log("connected as id " + connection.threadId)
})

// Makeing our db accessible to our router
app.use(function (req, res, next) {
  req.connect = connection
  next()
})

//mongo db connection
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("mongodb Database Connected")
  }
)
// imp: session block
// trying
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure:true,
      httpOnly: true,
    },
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
)
app.use(connectFlash())

// imp: adding views
app.set("views", [
  path.join(__dirname, "views"),

  path.join(__dirname, "views/doctor"),
  path.join(__dirname, "views/parent"),
  //   path.join(__dirname, "views/doctor"),
  //   path.join(__dirname, "views/parent"),
])
//Routes
const registerRoute = require("./routes/auth/register_route")
const loginRoute = require("./routes/auth/login_route")
const childRoute = require("./routes/children_module/child_route")
const staffRoute = require("./routes/madical_staff_module/medical_staff_route")
///mongodb Routes
const mongoDoctor = require("./mongoRoute/route.doctor")
const mongoParent = require("./mongoRoute/route.parent")
const mongoPublic = require("./mongoRoute/route.public")
//All route middlewares goes here

app.use(passport.initialize())
app.use(passport.session())
require("./utils/passport.auth") //simple auth //note: ucomeent original
// require("./utils/passportDoctor.auth") //including doctor passport authentication
// require("./utils/passportAdmin.auth") //including doctor passport authentication

app.use((req, res, next) => {
  res.locals.user = req.user
  // res.locals.doctor = req.doctor
  // res.locals.parent = req.parent
  next()
})

app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

// app.use(`${api}/register`, registerRoute)
// app.use(`${api}/login`, loginRoute)
// app.use(`${api}/child`, childRoute)
// app.use(`${api}/staff`, staffRoute)
//connecting mongo route
app.use(
  "/doctor",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/login" }),
  mongoDoctor
)
app.use("/parent", mongoParent)
app.use("/", mongoPublic)

app.use(
  express.urlencoded({
    extended: false,
  })
)
// app.use((req, res, next) => {
//   next(createHttpError.NotFound())
// })
//if error comes from above route

// app.use((error, req, res, next) => {
//   error.status = error.status || 500
//   res.status(error.status)
//   res.send(error)
// })

//Initializing port
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/")
  }
}

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("back")
  } else {
    next()
  }
}
