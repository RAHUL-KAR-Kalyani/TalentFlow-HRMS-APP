const { z } = require("zod");


const roleEnum = z.enum(["Admin", "HR", "Employee"]);


const googleLoginSchema = z.object({
    credential: z.string().min(1, "Google credential is required"),
    role: roleEnum
});

const registerSchema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // role: z.string()
    role: roleEnum
});

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // role: z.string()
    role: roleEnum
});

module.exports = { googleLoginSchema, registerSchema, loginSchema };