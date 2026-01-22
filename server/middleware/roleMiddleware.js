const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        if (Array.isArray(requiredRole)) {
            if (!requiredRole.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
            }
        }
        else {
            if (user.role !== requiredRole) {
                return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
            }
        }
        next();
    };
};

module.exports = roleMiddleware;