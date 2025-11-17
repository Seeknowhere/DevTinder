const validator = require('validator');

const validateSignup = (req) => {
    const {password} = req.body;

    if(!validator.isStrongPassword(password)){
        throw new Error('weak password')
    }
}

const validateEditProfile = (req) => {
    const allowedEditFields = [ "firstName", "lastName" , "age","skills"];

    const isValidOperation =  Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isValidOperation;
}
module.exports = {validateSignup , validateEditProfile};