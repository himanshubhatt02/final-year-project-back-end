const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

//importing verify middleware
const verify = require("../../helpers/token_verification");

const {
    newDiagnosticValidation,
} = require("../../helpers/validation");


//Adding new diagnostics
router.post('/new_diagnostic', verify, async (req, res) => {
    //getting data from body
    const child_id = req.body.child_id
    const doctor_id = req.body.doctor_id
    const diagnostic_name = req.body.diagnostic_name
    const date_of_diagnostic = req.body.date_of_diagnostic
    const status = req.body.status

    //Other data
    const diagnostic_id = uuidv4()


    //connection instance
    var db = req.connect

    const dbpool = db.promise()

    //Validate the data
    const { error } = newDiagnosticValidation(req.body);

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

    //if everything is fine 

    const diagnosticQuery = `INSERT INTO diagnostics (diagnostic_id, diagnostic_name, date_of_diagnostic, status, doctor_id, child_id) VALUES ('${diagnostic_id}', '${diagnostic_name}', '${date_of_diagnostic}', '${status}', '${doctor_id}', '${child_id}');`

    try {
        var [diagnosticRow, diagnosticField] = await dbpool.query(diagnosticQuery)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 'message': "Unable process request" })
    }

    return res.status(200).json({ message: "Diagnostic added" })
})


//Getting the children created by the medical staff

router.get('/get_children/:doctor_id', verify, async (req, res) => {

    //getting data from the body
    const doctor_id = req.params.doctor_id

    //connection instance
    var db = req.connect

    const dbpool = db.promise()

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

    //Getting the childrens

    const childrenQuery = `SELECT * FROM children WHERE doctor_id = '${doctor_id}'`

    try {
        var [childrenRow, childrenField] = await dbpool.query(childrenQuery)
    } catch (error) {
        return res.status(400).json({ 'message': "Unable process request" })
    }

    return res.status(200).json({ children: childrenRow })
})

module.exports = router;