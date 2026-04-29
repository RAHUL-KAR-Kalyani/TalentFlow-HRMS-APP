const { z } = require("zod");


const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Employee ID");

const monthMap = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4,
    May: 5, Jun: 6, Jul: 7, Aug: 8,
    Sep: 9, Oct: 10, Nov: 11, Dec: 12
};

const generatePayrollSchema = z.object({
    employeeId: objectIdSchema,
    month: z
        .string()
        .refine((val) => monthMap[val], {
            message: "Invalid month"
        })
        .transform((val) => monthMap[val]),

    year: z
        .number({ invalid_type_error: "Year must be a number" })
        .min(2000, "Invalid year")
        .max(2100, "Invalid year")
});

module.exports = {
    generatePayrollSchema
};