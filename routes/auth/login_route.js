const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const {
    loginValidation,
} = require("../../helpers/validation");

//Parent login 

router.post('/parent', async (req, res) => {

    //Getting data from body
    const email = req.body.email
    const password = req.body.password

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    //Validation

    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //Getting user details using user email
    try {
        var [userRow, userFields] = await dbpool.query(`SELECT * FROM parents WHERE email='${email}'`)
    } catch (error) {
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //if user not present
    if (userRow.length === 0) {
        return res.status(400).json({ message: "User not found" })
    }

    //comparing two passwords one is user entered and another one is the actual password
    const validPass = await bcrypt.compare(
        password,
        userRow[0]["sec_password"]
    );

    //If passwords do not match
    if (!validPass) {
        return res.status(400).json({ message: "Invalid password" });
    }

    //importing secret password
    const secret = process.env.SECRET;

    //Creating jwt
    const token = jwt.sign(
        {
            id: userRow[0]["uid"],
            email: email,
        },
        secret,
        { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Login Success", jwt: token, id: userRow[0]["uid"],pname:userRow[0]["name"] })
})


//Parent login 

router.post('/medical_staff', async (req, res) => {

    //Getting data from body
    const email = req.body.email
    const password = req.body.password

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    //Validation

    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //Getting user details using user email
    try {
        var [userRow, userFields] = await dbpool.query(`SELECT * FROM medical_staff WHERE email ='${email}'`)
    } catch (error) {
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //if user not present
    if (userRow.length === 0) {
        return res.status(400).json({ message: "User not found" })
    }

    //comparing two passwords one is user entered and another one is the actual password
    const validPass = await bcrypt.compare(
        password,
        userRow[0]["sec_password"]
    );

    //If passwords do not match
    if (!validPass) {
        return res.status(400).json({ message: "Invalid password" });
    }

    //importing secret password
    const secret = process.env.SECRET;

    //Creating jwt
    const token = jwt.sign(
        {
            id: userRow[0]["uid"],
            email: email,
        },
        secret,
        { expiresIn: "7d" }
    );
    console.log(userRow[0]["uid"]);

    return res.status(200).json({ message: "Login Success", jwt: token, id: userRow[0]["uid"],mname:userRow[0]["name"] })
})

//Exporting the user module
module.exports = router;