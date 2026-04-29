// const validateMiddleware = (schema) => (req, res, next) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//         return res.status(400).json({
//             // message: result.error.errors[0].message,
//             message: result.error.errors.map(e => e.message),
//             message: result.error.issues.map(e => e.message),
//             success: false
//         });
//     }
//     req.body = result.data;
//     next();
// };

// module.exports = validateMiddleware;


const validateMiddleware = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // const errors = result.error.errors[0].message;
        // const errors = result.error.errors.map(e => e.message);
        const errors = result.error.issues.map(e => e.message);

        return res.status(400).json({
            success: false,
            message: errors.join(" • ")
        });
    }

    req.body = result.data;
    next();
};

module.exports = validateMiddleware;