const jwt = require('jsonwebtoken');
/** @type {import("mongoose").Model<any>} */
const userModel = require('../models/userModel');

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        console.log("SECRET_KEY exists:", !!process.env.SECRET_KEY);
        console.log("Cookies:", req.cookies);
        console.log("Token:", req.cookies.token);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Pls login",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token. Pls login again",
                success: false
            });
        }

        const user = await userModel.findById(decode.userId);
        if (!user) {
            return res.status(401).json({
                message: "user not found. Pls login again",
                success: false
            });
        }
        

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        console.log("AUTH ERROR:", error.message);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

module.exports = isAuth;
