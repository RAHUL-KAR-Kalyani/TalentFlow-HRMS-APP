const { googleLoginService, registerService, loginService, profileService } = require("../services/userService");

const googleLoginController = async (req, res) => {
    try {

        const { credential, role } = req.body;

        const { user, token } = await googleLoginService({ credential, role });

        return res.status(200).cookie("token", token,
            { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 }).json({
                success: true,
                message: `Welcome ${user.name}!`,
                token,
                user
            });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const registerController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // if (!name || !email || !password || !role) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All fields are required"
        //     });
        // }

        await registerService({ name, email, password, role });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const loginController = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // if (!email || !password || !role) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All fields are required"
        //     });
        // }

        const { user, token } = await loginService({
            email,
            password,
            role
        });

        return res.status(200).cookie("token", token,
            { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "none" })
            .json({
                message: `Welcome ${user.name}!`,
                success: true,
                user,
                token
            });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });

    }
};


const profileController = async (req, res) => {
    try {
        const userId = req.body.userId;

        const userProfile = await profileService(userId);

        return res.status(200).json({
            success: true,
            message: "Profile retrieved",
            userProfile
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const logoutController = async (req, res) => {
    try {
        // return res.status(200).cookie("token", "", { maxAge: 0 }).json({
        //     message: "Logged out successfully",
        //     success: true
        // });
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};



module.exports = { googleLoginController, registerController, loginController, profileController, logoutController };
