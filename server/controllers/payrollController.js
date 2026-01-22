const payrollModel = require("../models/payrollModel");
const attendanceModel = require("../models/attendanceModel");
const Employee = require("../models/employeeModel");
const leaveRequestModel = require("../models/leaveRequestModel");

// payroll will generate only after salary credited

const generatePayrollController = async (req, res) => {
    try {
        let { employeeId, month, year } = req.body;

        const monthMap = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
        };
        const totalMonth = Object.keys(monthMap).length;
        console.log(totalMonth, 'totalMonth')
        month = monthMap[month]; // convert "Dec" → 12


        month = parseInt(month);
        year = parseInt(year);

        if (!month || !year || isNaN(month) || isNaN(year)) {
            return res.status(400).json({ success: false, message: "Invalid month/year" });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        console.log(employee, 'employee');

        const baseSalary = employee.salary;
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        console.log(baseSalary, 'baseSalary');
        console.log(startOfMonth, 'startOfMonth');
        console.log(endOfMonth, 'endOfMonth');

        const leaveDays = await leaveRequestModel.countDocuments({
            employee: employeeId,
            type: "Casual",
            status: "Approved",
            // date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        console.log(leaveDays, 'leaveDays as per leave model. Only Casual leave and approved counted');

        const absentDays = await attendanceModel.countDocuments({
            employee: employeeId,
            status: "Absent",
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        console.log(absentDays, 'absentDays');

        const attendanceDays = await attendanceModel.countDocuments({
            employee: employeeId,
            status: "Present",
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        console.log(attendanceDays, 'attendanceDays');

        const totalDaysInMonth = endOfMonth.getDate();
        console.log(totalDaysInMonth, 'totalDaysInMonth');

        const totalWorkingDays = totalDaysInMonth == 30 ? 22 : totalDaysInMonth == 31 ? 23 : 21; // or calculate dynamically
        console.log(totalWorkingDays, 'totalWorkingDays');

        // calculate grossMonthly salary
        const grossMonthlySalary = parseInt(baseSalary / totalMonth);
        console.log(grossMonthlySalary, 'grossMonthlySalary');

        // calculate per day salary/working days salary
        const perDaySalary = parseInt(grossMonthlySalary / totalWorkingDays);
        console.log(perDaySalary, 'perDaySalary')

        // calculate half day salary
        const halfDaySalary = parseInt(perDaySalary / 2);
        console.log(halfDaySalary, 'halfDaySalary')

        // calculate attendance day salary
        const attendanceSalary = attendanceDays * perDaySalary;
        console.log(attendanceSalary, 'attendanceSalary')

        // calculate leave DaysSalary
        const totalLeaveDays = leaveDays + absentDays;
        console.log(totalLeaveDays, 'totalLeaveDays')

        // calculate deduction salary or absentDaysSalary
        const deductions = totalLeaveDays * perDaySalary;   //same as absentDaysSalary
        console.log(deductions, 'total absentDaysSalary leaveDays+absentDays')

        // from now salary will be calculated on attendanceSalary
        const attendanceDaysSalary = grossMonthlySalary - deductions; //same as attendanceSalary

        // calculate allowance salary
        console.log(attendanceDaysSalary, 'attendanceDaysSalary')
        let allowances = 0

        // calculate netMonthly salary
        const netSalary = grossMonthlySalary + allowances - deductions;
        console.log(netSalary, 'netSalary')

        console.log(totalLeaveDays, 'totalLeaveDays')
        console.log(absentDays, 'absentDays')


        const existingPayroll = await payrollModel.findOne({
            employee: employeeId,
            month,
            year
        });

        if (existingPayroll) {
            return res.status(400).json({
                message: "This employee already has an active payroll record for this month.",
                success: false
            });
        }

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

        return res.status(201).json({
            success: true,
            message: "Payroll Generated Successfully",
            payroll
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};

// HR/ADMIN can view all payroll only after payroll generated
const getPayrollController = async (req, res) => {
    try {
        const payroll = await payrollModel.find().populate("employee");

        if (!payroll) {
            return res.status(404).json({
                message: "Payroll not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Payroll Retrieved Successfully",
            payroll,
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
}

// employee can view own payroll only after payroll generated
const getPayrollByIDController = async (req, res) => {

    try {
        console.log('employeeId from body');
        let employeeId = req.params.id;
        console.log(employeeId, 'employeeId from body');
        const payroll = await payrollModel.find({ employee: employeeId }).populate("employee");

        if (!payroll || payroll.length === 0) {
            return res.status(404).json({
                message: "Your Payroll not generated yet",
                success: false
            });
        }
        return res.status(200).json({
            message: "Payroll Retrieved",
            payroll,
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
}

const deletePayrollController = async (req, res) => {
    try {
        const payrollId = req.params.id;
        const deletedPayroll = await payrollModel.findByIdAndDelete(payrollId);

        if (!deletedPayroll) {
            return res.status(404).json({
                message: "Payroll not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Payroll Deleted Successfully",
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
}

module.exports = {
    generatePayrollController,
    getPayrollController,
    getPayrollByIDController,
    deletePayrollController
};
