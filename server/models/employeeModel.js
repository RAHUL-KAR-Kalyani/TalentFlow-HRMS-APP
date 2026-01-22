const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String
    },
    role: {
        type: String
    },
    employment_type: {
        type: String,
        enum: ['Permanent', 'Intern']
    },
    joiningDate: {
        type: Date,
        // required: true
    },
    salary: {
        type: Number,
        min: 0,
        default: 0
        // required: true,
    },
    // status: {
    //     type: String,
    //     enum: ['Active', 'Inactive'],
    //     default: 'Active'
    // }
}, { timestamps: true });

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = employeeModel;
