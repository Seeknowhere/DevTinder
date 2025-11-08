const validator = require('validator');

const validateSignup = (req) => {
    const {password} = req.body;

    if(!validator.isStrongPassword(password)){
        throw new Error('weak password')
    }
}

module.exports = validateSignup;