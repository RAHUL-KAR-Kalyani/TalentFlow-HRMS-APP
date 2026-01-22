// server/services/payrollService.js
const attendanceModel = require('../models/attendanceModel');
const payrollModel = require('../models/payrollModel');

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

module.exports = { computePayrollForMonth };