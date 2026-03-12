const {
    generatePayrollService,
    getPayrollService,
    getPayrollByIdService,
    deletePayrollService
} = require("../services/payrollService");


const generatePayrollController = async (req, res) => {
    try {

        const { employeeId, month, year } = req.body;

        const payroll = await generatePayrollService({
            employeeId,
            month,
            year
        });

        return res.status(201).json({
            success: true,
            message: "Payroll Generated Successfully",
            payroll
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getPayrollController = async (req, res) => {
    try {

        const payroll = await getPayrollService();

        return res.status(200).json({
            success: true,
            message: "Payroll Retrieved Successfully",
            payroll
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const getPayrollByIDController = async (req, res) => {
    try {

        const employeeId = req.params.id;

        const payroll = await getPayrollByIdService(employeeId);

        return res.status(200).json({
            success: true,
            message: "Payroll Retrieved",
            payroll
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const deletePayrollController = async (req, res) => {
    try {

        const payrollId = req.params.id;

        await deletePayrollService(payrollId);

        return res.status(200).json({
            success: true,
            message: "Payroll Deleted Successfully"
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    generatePayrollController,
    getPayrollController,
    getPayrollByIDController,
    deletePayrollController
};
