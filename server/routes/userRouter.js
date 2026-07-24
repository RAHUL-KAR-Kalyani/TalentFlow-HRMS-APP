const express = require('express');
const { googleLoginController, registerController, loginController, logoutController, profileController } = require('../controllers/userController');
const isAuth = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validations/userValidation');

const userRouter = express.Router();

userRouter.post("/google-login", googleLoginController);
userRouter.post('/register', validateMiddleware(registerSchema), registerController);
userRouter.post('/login', validateMiddleware(loginSchema), loginController);
userRouter.get('/profile', isAuth, profileController);
userRouter.get('/logout', isAuth, logoutController);

module.exports = userRouter;