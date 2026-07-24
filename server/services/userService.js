const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const employeeModel = require("../models/employeeModel");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginService = async ({ credential, role }) => {

    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });

    const payload = ticket.getPayload();

    const { name, email } = payload;

    let user = await userModel.findOne({ email });

    // Register automatically if user doesn't exist
    if (!user) {
        const randomPassword = await bcrypt.hash(Math.random().toString(36), parseInt(process.env.SALT));
        user = await userModel.create({ name, email, password: randomPassword, role });
    }

    // Role validation
    if (user.role.toLowerCase() !== role.toLowerCase()) {
        throw new Error("Role mismatch! Please select the correct role");
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    return { user, token };
};

const registerService = async ({ name, email, password, role }) => {

    if (role === "Employee") {
        const enrolledEmployee = await employeeModel.findOne({ email });

        if (!enrolledEmployee) {
            throw new Error(
                "You are not authorized to register as Employee. Contact Admin/HR"
            );
        }
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    const user = await userModel.create({ name, email, password: hashedPassword, role });

    return user;
};

const loginService = async ({ email, password, role }) => {

    let user = await userModel.findOne({ email });
    if (!user) {
        throw new Error("Incorrect email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect password");
    }

    if (role.toLowerCase() !== user.role.toLowerCase()) {
        throw new Error("Role mismatch! Please select the correct role");
    }

    const tokenData = { userId: user._id };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    return { user, token };
};

const profileService = async (userId) => {

    const userProfile = await userModel
        .findById(userId)
        .select("-password");

    if (!userProfile) {
        throw new Error("User not found");
    }

    return userProfile;
};


module.exports = { googleLoginService, registerService, loginService, profileService };