const Joi = require("joi");

//Register validation

const parentRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        phone_number: Joi.string().required(),
    });

    return schema.validate(data);
};


const medicalStaffRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        phone_number: Joi.string().required(),
        designation: Joi.string().required(),
    });

    return schema.validate(data);
};


//Login validation

const LoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data)
}


//child verification

const ChildDataValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        dateofbirth: Joi.string().required(),
        weight: Joi.string().required(),
        height: Joi.string().required(),
        temperature: Joi.string().required(),
        incubator_temperature: Joi.string().empty(),
        doctor_id: Joi.string().min(5).required(),
        parents_id: Joi.string().min(5).required(),
    })

    return schema.validate(data)
}

//child temperature verification
const ChildTemperatureValidation = (data) => {
    const schema = Joi.object({
        temperature: Joi.string().required(),
        incubator_temperature: Joi.string().empty(),
        doctor_id: Joi.string().min(5).required(),
        child_id: Joi.string().min(5).required(),
    })

    return schema.validate(data)
}


//Diagnostic validation

const NewDiagnosticValidation = (data) => {
    const schema = Joi.object({
        child_id: Joi.string().required(),
        doctor_id: Joi.string().required(),
        diagnostic_name: Joi.string().required(),
        date_of_diagnostic: Joi.string().required(),
        status: Joi.string().required(),
    })

    return schema.validate(data)
}

//Exporting modules
module.exports.parentRegisterValidation = parentRegisterValidation;
module.exports.medicalStaffRegisterValidation = medicalStaffRegisterValidation;
module.exports.loginValidation = LoginValidation;
module.exports.childDataValidation = ChildDataValidation;
module.exports.childTemperatureValidation = ChildTemperatureValidation;
module.exports.newDiagnosticValidation = NewDiagnosticValidation;
