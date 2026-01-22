const express = require('express');
const { registerController, loginController, logoutController, profileController } = require('../controllers/userController');
const isAuth = require('../middleware/authMiddleware');


const userRouter = express.Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/profile', isAuth, profileController);
userRouter.get('/logout', isAuth, logoutController);

module.exports = userRouter;