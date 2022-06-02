const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
//importing verify middleware
const verify = require("../../helpers/token_verification");


const {
    childDataValidation,
    childTemperatureValidation,
} = require("../../helpers/validation");


//Creating new child profile

router.post('/add-child', verify, async (req, res) => {
    //Getting details from body
    const name = req.body.name
    const dateofbirth = req.body.dateofbirth
    const weight = req.body.weight
    const height = req.body.height
    const temperature = req.body.temperature
    const incubator_temperature = req.body.incubator_temperature
    const doctor_id = req.body.doctor_id
    const parents_id = req.body.parents_id

    //new details
    // const timeofbirth = req.body.timeofbirth
    // const blood_group = req.body.blood_group
    // const pulse_rate  = req.body.pulse_rate
    // const mother_name = req.body.mother_name
    // const father_name = req.body.father_name
    // const email = req.body.email
    // const mobile = req.body.mobile
    // const address = req.body.address
    // const humidity = req.body.humidity
    // const co2 = req.body.co2
    // const o2 = req.body.o2
    


    //other details
    const child_id = uuidv4()
    const created_date = Date.now()

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    //Validate the data
    const { error } = childDataValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //check if doctor is is proper
    const docQuery = `SELECT * FROM medical_staff WHERE uid = '${doctor_id}'`

    try {
        var [docRow, docField] = await dbpool.query(docQuery)
    } catch (error) {
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //If medical_staff not found 
    if (docRow.length !== 1) {
        return res.status(400).json({ message: "Access Denied" })
    }

    //checking for the parent id
    const parentQuery = `SELECT * FROM parents WHERE uid = '${parents_id}'`

    try {
        var [parRow, parField] = await dbpool.query(docQuery)
    } catch (error) {
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //If parent not found 
    if (parRow.length !== 1) {
        return res.status(400).json({ message: "Parent Not Found" })
    }

    //Now we can create child account
    const childQuery = `INSERT INTO children (child_id, name, dateofbirth, weight, height, temperature, doctor_id, parent_id, created_date, incubator_temp) VALUES('${child_id}','${name}','${dateofbirth}','${weight}','${height}','${temperature}','${doctor_id}','${parents_id}','${created_date}','${incubator_temperature}')`

    try {
        var [childRow, childField] = await dbpool.query(childQuery)
    } catch (error) {
        return res.status(400).json({ 'message': "Unable process request" })
    }

    return res.status(200).json({ message: "Child Account Created", id: child_id })
})


//Getting childern of specific parent

router.get('/get-child/:parentId', verify, async (req, res) => {
    //Getting data from param

    const parentId = req.params.parentId

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    //checking for the parent id
    const parentQuery = `SELECT * FROM parents WHERE uid = '${parentId}'`

    try {
        var [parRow, parField] = await dbpool.query(parentQuery)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //If parent not found 
    if (parRow.length !== 1) {
        return res.status(400).json({ message: "Parent Not Found" })
    }

    //Getting the children details 
    const childrenQuery = `SELECT * FROM children WHERE parent_id = '${parentId}'`

    try {
        var [childrenRow, childrenField] = await dbpool.query(childrenQuery)
    } catch (error) {
        return res.status(400).json({ message: "Unable process request" })
    }

    return res.status(200).json({ children: childrenRow })
})


//Updating the incubator temperature and body temperature

router.put('/update-temperature', verify, async (req, res) => {
    //getting data from body
    const temperature = req.body.temperature
    const incubator_temperature = req.body.incubator_temperature
    const doctor_id = req.body.doctor_id
    const child_id = req.body.child_id

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    //Validate the data
    const { error } = childTemperatureValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //check if doctor is is proper
    const docQuery = `SELECT * FROM medical_staff WHERE uid = '${doctor_id}'`

    try {
        var [docRow, docField] = await dbpool.query(docQuery)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //If medical_staff not found 
    if (docRow.length !== 1) {
        return res.status(400).json({ message: "Access Denied" })
    }

    //check if child is is proper
    const childQuery = `SELECT * FROM children WHERE child_id = '${child_id}'`

    try {
        var [childRow, childField] = await dbpool.query(childQuery)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 'message': "Unable process request" })
    }

    //If medical_staff not found 
    if (childRow.length !== 1) {
        return res.status(400).json({ message: "Child not found" })
    }

    //Updating the temprature

    const tempUpdateQuery = `UPDATE children SET temperature = '${temperature}', incubator_temp= '${incubator_temperature}' WHERE child_id = '${child_id}';`

    try {
        var [tempUpdateRow, tempUpdateField] = await dbpool.query(tempUpdateQuery)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 'message': "Unable process request" })
    }

    return res.status(200).json({ message: "Temprature updated" })

})

router.get('/parent/:id', async (req, res) => {
var id = req.params.id

 //connection instance
 var db = req.connect

 const dbpool = db.promise()


const query = `SELECT * FROM parents WHERE uid = ${id}`;

try {
        var [childrenRow, childrenField] = await dbpool.query(query)
    } catch (error) {
        return res.status(400).json({ message: "Unable process request" })
    }

    return res.status(200).json({ children: childrenRow })
})

//Exporting the user module
module.exports = router;