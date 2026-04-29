const mongoose = require("mongoose");
const attendanceModel = require("../models/attendanceModel");

// const markAttendanceService = async ({ employee, date, status }) => {

//     const exists = await attendanceModel.findOne({ employee, date });
//     if (exists) {
//         throw new Error("Attendance already marked");
//     }

//     const newAttendance = await attendanceModel.create({ employee, date: new Date(date), status });
//     return newAttendance;
// };


const markAttendanceService = async ({ employee, date, status }) => {

    const parsedDate = new Date(date);

    const exists = await attendanceModel.findOne({ 
        employee, 
        date: parsedDate 
    });

    if (exists) {
        throw new Error("Attendance already marked");
    }

    const newAttendance = await attendanceModel.create({ 
        employee, 
        date: parsedDate, 
        status 
    });

    return newAttendance;
};

const getAttendanceService = async () => {

    const attendance = await attendanceModel.find().populate("employee");
    if (!attendance || attendance.length === 0) {
        throw new Error("Attendance records not found");
    }

    return attendance;
};

const getAttendanceByIdService = async (attendanceId) => {

    const attendance = await attendanceModel.findById(attendanceId);
    if (!attendance) {
        throw new Error("Attendance not found");
    }

    return attendance;
};

const getAttendanceByEmployeeIdService = async (employeeId) => {

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        throw new Error("Invalid employee ID");
    }

    const attendance = await attendanceModel.find({ employee: employeeId }).populate("employee");
    if (!attendance || attendance.length === 0) {
        throw new Error("No attendance found for this employee");
    }

    return attendance;
};

const updateAttendanceService = async (attendanceId, updatedData) => {

    const attendance = await attendanceModel.findById(attendanceId);
    if (!attendance) {
        throw new Error("Attendance record not found");
    }

    const now = new Date();
    const attendanceTime = new Date(attendance.createdAt);
    const diffInHours = (now - attendanceTime) / (1000 * 60 * 60);
    if (diffInHours > 24) {
        throw new Error("Attendance can only be modified within 24 hours");
    }

    const updatedAttendance = await attendanceModel
        .findByIdAndUpdate(attendanceId, updatedData, { new: true })
        .populate("employee");

    return updatedAttendance;
};

const deleteAttendanceService = async (attendanceId) => {

    const attendance = await attendanceModel.findById(attendanceId);
    if (!attendance) {
        throw new Error("Attendance record not found");
    }

    await attendanceModel.findByIdAndDelete(attendanceId);

    return true;
};

module.exports = {
    markAttendanceService,
    getAttendanceService,
    getAttendanceByIdService,
    getAttendanceByEmployeeIdService,
    updateAttendanceService,
    deleteAttendanceService
};