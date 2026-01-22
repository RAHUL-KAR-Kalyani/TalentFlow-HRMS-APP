const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/** @type {import('mongoose').Model<any>} */
const userModel = require("../models/userModel");
const employeeModel = require("../models/employeeModel");

// profileController
// logoutController



const registerController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(name, email, password, role);

        // validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // const enrolledEmployee = await employeeModel.findOne({ role: 'employee', email });
        // if (!enrolledEmployee) {
        //     return res.status(400).json({
        //         message: "You are not authorized to register as employee. Contact Admin/HR",
        //         success: false
        //     });
        // }

        if (role === 'employee') {
            const enrolledEmployee = await employeeModel.findOne({ email });
            if (!enrolledEmployee) {
                return res.status(400).json({
                    message: "You are not authorized to register as employee. Contact Admin/HR",
                    success: false
                });
            }
        }


        // check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                success: false
            });
        }

        //encrypt password and create user
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        await userModel.create({ name, email, password: hashedPassword, role });

        // const user = await userModel.create({ name, email, password: hashedPassword, role });

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            // user
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
}


const loginController = async (req, res) => {
    try {
        console.log('request from ', req.body)

        const { email, password, role } = req.body;
        console.log(email, password, role);

        // validation
        if (!email, !password, !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // check if user already exists
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "incorrect email",
                success: false
            });
        }

        //pwd check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "incorrect password",
                success: false
            });
        }

        // role check
        if (role.toLowerCase() !== user.role.toLowerCase()) {
            return res.status(403).json({
                message: "role mismatch! please select the correct role",
                success: false
            });
        }
        // jwt token
        const tokenData = {
            userId: user._id,
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        // if (role === 'employee' || role === 'HR') {
        //     const inactiveEmployee = await employeeModel.findOne({ status: 'inactive', email });
        //     if (!inactiveEmployee) {
        //         return res.status(400).json({
        //             message: "You are not authorized to login as employee.",
        //             success: false
        //         });
        //     }
        // }


        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 62 * 1000, httpPnly: true, samesite: 'strict' }).json({
            message: `Welcome ${user.name} !`,
            success: true,
            user,
            token
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
}


const profileController = async (req, res) => {
    try {
        const userId = req.body.userId;     // user has to send userId in body
        // const userId = req.user._id;
        console.log('userProfile');

        const userProfile = await userModel.findById(userId).select('-password');
        console.log('userProfile');

        if (!userProfile) {
            console.log('user not found')
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        console.log(userProfile);
        return res.status(200).json({
            message: "Profile retrived",
            userProfile,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}


const logoutController = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}



module.exports = { registerController, loginController, profileController, logoutController };