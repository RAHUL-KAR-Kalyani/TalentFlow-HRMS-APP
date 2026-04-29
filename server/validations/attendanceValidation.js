const { z } = require("zod");

const markAttendanceSchema = z.object({
    employee: z.string().min(1, "Employee ID is required"),
    date: z.string().min(1, "Date is required"),
    status: z.enum(["Present", "Leave"])
});


const updateAttendanceSchema = z.object({
    employee: z.string().min(1).optional(),
    date: z.string().min(1).optional(),
    status: z.enum(["Present","Absent", "Leave"]).optional()
});




module.exports = { markAttendanceSchema, updateAttendanceSchema };