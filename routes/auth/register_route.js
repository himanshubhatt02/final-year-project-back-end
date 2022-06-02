const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const {
    parentRegisterValidation,
    medicalStaffRegisterValidation,
} = require("../../helpers/validation");



//Parent registartion 

router.post('/parent', async (req, res, next) => {

    //Data from request body
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const phone_number = req.body.phone_number

    //other data
    const created_date = Date.now()
    const uid = uuidv4()

    const { error } = parentRegisterValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    try {
        var [row, fields] = await dbpool.query(`SELECT * FROM parents WHERE email ='${email}'`)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "message": "Unable process request" })
    }


    if (row.length > 0) {
        return res.status(400).json({ message: "Email id already in use" })
    }

    //Encrypting password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Creating new user account

    const parent_query = `INSERT INTO parents (uid, name, email, sec_password, phone_number, created_date) VALUES ('${uid}', '${name}', '${email}', '${hashPassword}', '${phone_number}', '${created_date}');`

    try {
        var [createStatus, createFields] = await dbpool.query(parent_query)
        console.log(createStatus);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Unable process request" })
    }

    return res.status(200).json({ message: "Account Created" })
})



//Medical staff registartion

router.post('/medical_staff', async (req, res, next) => {

    //Data from request body
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const phone_number = req.body.phone_number
    const designation = req.body.designation

    //other data
    const created_date = Date.now()
    const uid = uuidv4()

    const { error } = medicalStaffRegisterValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    try {
        var [row, fields] = await dbpool.query(`SELECT * FROM medical_staff WHERE email ='${email}'`)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "message": "Unable process request" })
    }


    if (row.length > 0) {
        return res.status(400).json({ message: "Email id already in use" })
    }

    //Encrypting password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Creating new user account

    const staff_query = `INSERT INTO medical_staff (uid, name, email, sec_password, phone_number, designation ,created_date) VALUES ('${uid}', '${name}', '${email}', '${hashPassword}', '${phone_number}', '${designation}','${created_date}');`

    try {
        var [createStatus, createFields] = await dbpool.query(staff_query)
        console.log(createStatus);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Unable process request" })
    }

    return res.status(200).json({ message: "Account Created" })
})





//Exporting the user module
module.exports = router;