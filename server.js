const express = require('express')
const morgan = require("morgan");
const cors = require("cors");
const helmet = require('helmet');
var mysql = require('mysql2');


const app = express()

// importing dot env
require("dotenv/config");


//initializing api
//which is the initial route of api
const api = process.env.API_URL;


//CORS
app.use(cors());
app.options("*", cors());

// Middlewares
// Middleware to serve static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(morgan("tiny"));
//Always use helmet for safety
app.use(helmet());



//Mysqldb  connection

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'child_care'
});


connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});


// Makeing our db accessible to our router
app.use(function (req, res, next) {
    req.connect = connection;
    next();
});


//Routes
const registerRoute = require("./routes/auth/register_route");
const loginRoute = require("./routes/auth/login_route");
const childRoute = require("./routes/children_module/child_route");
const staffRoute = require("./routes/madical_staff_module/medical_staff_route");

//All route middlewares goes here
app.use(`${api}/register`, registerRoute);
app.use(`${api}/login`, loginRoute);
app.use(`${api}/child`, childRoute);
app.use(`${api}/staff`, staffRoute);





//Initializing port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})