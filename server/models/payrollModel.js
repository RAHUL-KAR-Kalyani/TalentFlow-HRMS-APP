const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    month: {
        type: Number, // 1-12
        // type: String, // January, February, etc.
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    totalPresentDays: {
        type: Number,
        required: true
    },
    absentDays: {
        type: Number,
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const payrollModel = mongoose.model("Payroll", payrollSchema);
module.exports = payrollModel;
