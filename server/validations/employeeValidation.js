const { z } = require("zod");

const createEmployeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email().min(1, "Invalid email address"),
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(1, "Designation is required"),
    role: z.enum(["admin", "hr", "employee"]).optional(),
    employment_type: z.enum(["Permanent", "Intern"]),
    joiningDate: z.string().optional(),
    salary: z.string().optional().transform(val => (val ? Number(val) : undefined))
});

const updateEmployeeSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email().min(1, "Invalid email address").optional(),
    department: z.string().min(1, "Department is required").optional(),
    designation: z.string().min(1, "Designation is required").optional(),
    role: z.enum(["admin", "hr", "employee"]).optional(),
    employment_type: z.enum(["Permanent", "Intern"]).optional(),
    joiningDate: z.string().optional(),
    salary: z.string().optional().transform(val => (val ? Number(val) : undefined))
})

module.exports = { createEmployeeSchema, updateEmployeeSchema }