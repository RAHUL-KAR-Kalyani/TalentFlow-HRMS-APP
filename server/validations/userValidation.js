const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // role: z.string()
    role: z.enum(["Admin", "HR", 'Employee'])
});

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // role: z.string()
    role: z.enum(["Admin", "HR", 'Employee'])
});

module.exports = { registerSchema, loginSchema };