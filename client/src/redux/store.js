import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import employeeReducer from "./employeeSlice";
import attendanceReducer from "./attendanceSlice"
import leaveReducer from "./leaveSlice";
import payrollReducer from "./payrollSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employee: employeeReducer,
        attendance: attendanceReducer,
        leave: leaveReducer,
        payroll: payrollReducer,
    },
    // devTools: import.meta.env.MODE == "production", // do it to hide redux store variable in production
    // devTools: import.meta.env.MODE !== "development",   // do it to hide redux store variable in development

    
})