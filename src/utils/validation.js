const validator = require('validator');

const validation = (req) => {
    const {password} = req.body;

    if(!validator.isStrongPassword(password)){
        throw new Error('weak password')
    }
}

module.exports = validation;