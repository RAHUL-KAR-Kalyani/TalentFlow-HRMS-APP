const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRouter');
const cors = require('cors');
const employeeRouter = require('./routes/employeeRouter');
const attendanceRouter = require('./routes/attendanceRouter');
const leaveRequestRouter = require('./routes/leaveRequestRouter');
const payrollRouter = require('./routes/payrollRouter');
const startAutoAbsentJob = require('./services/autoAbsentJob');
// const globalErrorHandler = require('./middleware/globalErrorHandler');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT;
const corsOption = {
    origin: process.env.FRONTEND_URL,
    credentials: true
}


// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));


// Routes
app.get('/', (req, res) => {
    return res.send({
        message: 'Welcome to the TalentFlow-HRMS API',
        success: true
    });
});

app.use('/user', userRouter);
app.use('/employee', employeeRouter);
app.use('/attendance', attendanceRouter);
app.use('/leave', leaveRequestRouter);
app.use('/payroll', payrollRouter);

// app.use(globalErrorHandler);

startAutoAbsentJob();

// Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at: http://localhost:${PORT}/`);
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
});