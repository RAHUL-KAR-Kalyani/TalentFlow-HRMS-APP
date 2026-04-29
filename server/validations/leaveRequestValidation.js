const { z } = require("zod");

const createLeaveRequestSchema = z.object({
    employee: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Employee ID"),
    type: z.enum(["Casual", "Sick", "Paid"]),
    startDate: z.string().min(1, "startDate required"),
    endDate: z.string().min(1, "endDate required")
})

module.exports = {
    createLeaveRequestSchema
}