const attendanceModel = require('../models/attendanceModel');
const payrollModel = require('../models/payrollModel');
const employeeModel = require("../models/employeeModel");
const leaveRequestModel = require("../models/leaveRequestModel");

async function computePayrollForMonth(employeeId, month, year, baseSalary, workingDays = 22) {
    // build month range
    const start = new Date(year, Number(month) - 1, 1);
    const end = new Date(year, Number(month), 1); // exclusive

    // count absences for that employee in range
    const absentDays = await attendanceModel.countDocuments({
        employee: employeeId,
        status: 'Absent',
        date: { $gte: start, $lt: end }
    });

    const perDay = baseSalary / workingDays;
    const deductions = perDay * absentDays;
    const netSalary = baseSalary + allowances - deductions; // add allowances if available

    // upsert payroll record for employee/month
    const payroll = await payrollModel.findOneAndUpdate(
        { employeeId, month: String(month), year },
        { employeeId, baseSalary, allowances, deductions, netSalary, month: String(month), year },
        { upsert: true, new: true }
    );

    return { payroll, absentDays, deductions, netSalary };
}

const monthMap = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
};

const generatePayrollService = async ({ employeeId, month, year }) => {

    // month = monthMap[month];
    // month = parseInt(month);
    // year = parseInt(year);

    // if (!month || !year || isNaN(month) || isNaN(year)) {
    //     throw new Error("Invalid month/year");
    // }

    const employee = await employeeModel.findById(employeeId);

    if (!employee) {
        throw new Error("Employee not found");
    }

    const existingPayroll = await payrollModel.findOne({
        employee: employeeId,
        month,
        year
    });

    if (existingPayroll) {
        throw new Error(
            "This employee already has an active payroll record for this month."
        );
    }

    const baseSalary = employee.salary;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const leaveDays = await leaveRequestModel.countDocuments({
        employee: employeeId,
        type: "Casual",
        status: "Approved"
    });

    const absentDays = await attendanceModel.countDocuments({
        employee: employeeId,
        status: "Absent",
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const attendanceDays = await attendanceModel.countDocuments({
        employee: employeeId,
        status: "Present",
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalDaysInMonth = endOfMonth.getDate();

    const totalWorkingDays =
        totalDaysInMonth === 30 ? 22 :
            totalDaysInMonth === 31 ? 23 : 21;

    const totalMonth = 12;

    const grossMonthlySalary = parseInt(baseSalary / totalMonth);

    const perDaySalary = parseInt(grossMonthlySalary / totalWorkingDays);

    const totalLeaveDays = leaveDays + absentDays;

    const deductions = totalLeaveDays * perDaySalary;

    const allowances = 0;

    const netSalary = grossMonthlySalary + allowances - deductions;

    const payroll = await payrollModel.create({
        employee: employeeId,
        month,
        year,
        totalDays: totalWorkingDays,
        totalPresentDays: attendanceDays,
        absentDays: totalLeaveDays,
        baseSalary: grossMonthlySalary,
        allowances,
        deductions,
        netSalary
    });

    return payroll;
};


const getPayrollService = async () => {

    const payroll = await payrollModel
        .find()
        .populate("employee");

    if (!payroll || payroll.length === 0) {
        throw new Error("Payroll not found");
    }

    return payroll;
};


const getPayrollByIdService = async (employeeId) => {

    const payroll = await payrollModel
        .find({ employee: employeeId })
        .populate("employee");

    if (!payroll || payroll.length === 0) {
        throw new Error("Your Payroll not generated yet");
    }

    return payroll;
};


const deletePayrollService = async (payrollId) => {

    const deletedPayroll = await payrollModel.findByIdAndDelete(payrollId);

    if (!deletedPayroll) {
        throw new Error("Payroll not found");
    }

    return true;
};

module.exports = {
    computePayrollForMonth,
    generatePayrollService,
    getPayrollService,
    getPayrollByIdService,
    deletePayrollService
};