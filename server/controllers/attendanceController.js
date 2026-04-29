const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
    markAttendanceService,
    getAttendanceService,
    getAttendanceByIdService,
    getAttendanceByEmployeeIdService,
    updateAttendanceService,
    deleteAttendanceService
} = require("../services/attendanceService");


const markAttendanceController = async (req, res) => {
    try {

        const { employee, date, status } = req.body;

        // const missingFields = [];
        // if (!employee) missingFields.push("employee");
        // if (!date) missingFields.push("date");
        // if (!status) missingFields.push("status");

        // if (missingFields.length > 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Missing fields: ${missingFields.join(", ")}`,
        //         missingFields
        //     });
        // }

        if (status !== "Present" && status !== "Leave") {
            return res.status(400).json({
                success: false,
                message: "Employees can only mark Present or Leave"
            });
        }

        const attendance = await markAttendanceService({ employee, date, status });

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const getAttendanceController = async (req, res) => {
    try {

        const attendance = await getAttendanceService();

        return res.status(200).json({
            success: true,
            message: "Attendance records retrieved successfully",
            attendance
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


const getAttendanceControllerById = async (req, res) => {
    try {

        const attendanceId = req.params.id;

        const attendance = await getAttendanceByIdService(attendanceId);

        return res.status(200).json({
            success: true,
            message: "Attendance record retrieved successfully",
            attendance
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


const getAttendanceControllerByEmployeeId = async (req, res) => {
    try {

        const employeeId = req.params.id;

        const attendance = await getAttendanceByEmployeeIdService(employeeId);

        return res.status(200).json({
            success: true,
            message: "Attendance records retrieved successfully",
            attendance
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const updateAttendanceController = async (req, res) => {
    try {

        const attendanceId = req.params.id;
        const updatedData = req.body;

        const attendance = await updateAttendanceService(attendanceId, updatedData);

        return res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const deleteAttendanceController = async (req, res) => {
    try {

        const attendanceId = req.params.id;

        await deleteAttendanceService(attendanceId);

        return res.status(200).json({
            success: true,
            message: "Attendance deleted successfully"
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    markAttendanceController,
    getAttendanceController,
    getAttendanceControllerById,
    getAttendanceControllerByEmployeeId,
    updateAttendanceController,
    deleteAttendanceController
};
