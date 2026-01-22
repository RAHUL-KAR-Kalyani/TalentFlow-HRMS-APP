const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
/** @type {import('mongoose').Model<any>} */
const attendanceModel = require("../models/attendanceModel");


const markAttendanceController = async (req, res) => {
    try {
        const { employee, date, status } = req.body;
        // Validate required fields and report which are missing
        const missingFields = [];
        if (!employee) missingFields.push('employee');
        if (!date) missingFields.push('date');
        if (!status) missingFields.push('status');
        if (status !== "Present" && status !== "Leave") {
            return res.status(400).json({
                message: "Employees can only mark Present or Leave",
                success: false
            });
        }
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
                missingFields,
                success: false
            });
        }

        // if (req.user._id.toString() !== employee.toString()) {
        //     return res.status(403).json({
        //         message: "You can mark only your own attendance",
        //         success: false
        //     });
        // }

        // // Normalize date (important)
        // const attendanceDate = new Date(date);
        // attendanceDate.setHours(0, 0, 0, 0);


        const exists = await attendanceModel.findOne({ employee, date });

        if (exists) {
            return res.status(400).json({ message: "Attendance already marked" });
        }

        // Create a new attendance record
        const newAttendance = await attendanceModel.create({ employee, date: new Date(date), status });

        if (status === 'absent') {
        }

        return res.status(201).json({
            message: "Attendance marked successfully",
            success: true,
            attendance: newAttendance
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

const getAttendanceController = async (req, res) => {
    try {
        const attendance = await attendanceModel.find().populate('employee');
        if (!attendance || attendance.length === 0) {
            return res.status(404).json({
                message: "Attendance records not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Attendance records retrieved successfully",
            success: true,
            attendance,
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

const getAttendanceControllerById = async (req, res) => {
    try {
        const attendanceId = req.params.id;
        const attendance = await attendanceModel.findById(attendanceId);
        console.log("ID:", attendanceId);
        console.log("attendance:", attendance);
        if (!attendance) {
            return res.status(404).json({
                message: "You don't have any Attendance",
                success: false
            });
        }
        return res.status(200).json({
            message: "Attendance records retrieved successfully",
            success: true,
            attendance,
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


const getAttendanceControllerByEmployeeId = async (req, res) => {
    try {
        const employeeId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID'
            });
        }

        const attendance = await attendanceModel
            .find({ employee: employeeId })
            .populate('employee'); // optional but recommended

        if (!attendance || attendance.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No attendance found for this employee'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Attendance records retrieved successfully',
            attendance
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};

const updateAttendanceController = async (req, res) => {
    try {
        const attendanceId = req.params.id;
        const updatedData = req.body;

        const attendance = await attendanceModel.findById(attendanceId);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found",
                success: false
            });
        }

        const now = new Date();
        const attendanceTime = new Date(attendance.createdAt); // or attendance.date

        const diffInHours = (now - attendanceTime) / (1000 * 60 * 60);
        // Allow modification only within 24 hours of creation

        if (diffInHours > 24) {
            return res.status(403).json({
                message: "Attendance can only be modified within 24 hours",
                success: false
            });
        }

        const updatedAttendance = await attendanceModel.findByIdAndUpdate(attendanceId, updatedData, { new: true }).populate("employee");

        if (!updatedAttendance) {
            return res.status(404).json({
                message: "Attendance record not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Attendance updated successfully",
            success: true,
            attendance: updatedAttendance,
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

const deleteAttendanceController = async (req, res) => {
    try {
        const attendanceId = req.params.id;

        const attendance = await attendanceModel.findById(attendanceId);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found",
                success: false
            });
        }

        await attendanceModel.findByIdAndDelete(attendanceId);

        return res.status(200).json({
            message: "Attendance deleted successfully",
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
};

module.exports = {
    markAttendanceController,
    getAttendanceController,
    getAttendanceControllerById,
    getAttendanceControllerByEmployeeId,
    updateAttendanceController,
    deleteAttendanceController
};