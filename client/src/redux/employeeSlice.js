import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        loading: false,
        employees: [],
        searchEmployeeByName: '',
        selectedEmployee: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSearchEmployeeByName: (state, action) => {
            state.searchEmployeeByName = action.payload
        },
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
        addEmployee: (state, action) => {
            state.employees.push(action.payload);
        },
        updateEmployee: (state, action) => {
            const index = state.employees.findIndex(emp => emp._id === action.payload._id);
            if (index !== -1) {
                state.employees[index] = action.payload;
            }
        },
        deleteEmployee: (state, action) => {
            state.employees = state.employees.filter(emp => emp._id !== action.payload._id);
        },
        // deactivateEmployee: (state, action) => {
        //     const index = state.employees.findIndex(
        //         emp => emp._id === action.payload._id
        //     );
        //     if (index !== -1) {
        //         state.employees[index].status = "Inactive";
        //     }
        // },
    },
})

export const { setEmployees, setLoading, addEmployee, updateEmployee, deleteEmployee, setSearchEmployeeByName } = employeeSlice.actions;
export default employeeSlice.reducer;