const mongoose = require('mongoose')
const validator = require('validator')
const { isPhoneNumber } = require('../../../util/valid')

const ContactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    phone: {
        type: String,
        trim: true,
        validate: [isPhoneNumber, 'Please provide a valid phone number'],
        required: true
    },
    company_name: {
        type: String,
        trim: true
    },
    project_name: {
        type: String,
        trim: true
    },
    project_desc: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    file: {
        type: String,
        trim: true
    }
}, { timestamps: true })


module.exports = mongoose.model('Contact', ContactSchema)
