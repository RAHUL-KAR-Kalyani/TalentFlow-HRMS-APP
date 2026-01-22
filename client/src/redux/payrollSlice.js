import { createSlice } from "@reduxjs/toolkit";

const payrollSlice = createSlice({
    name: 'payroll',
    initialState: {
        loading: false,
        payroll: [],
        searchPayrollByName: '',
        selectedPayroll: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setPayroll: (state, action) => {
            state.payroll = action.payload;
        },
        setSearchPayrollByName: (state, action) => {
            state.searchPayrollByName = action.payload;
        },
        setSelectedPayroll: (state, action) => {
            state.selectedPayroll = action.payload;
        },
        addPayroll: (state, action) => {
            state.payroll.push(action.payload);
        },
        updatePayroll: (state, action) => {
            const index = state.payroll.findIndex(pay => pay._id === action.payload._id);
            if (index !== -1) {
                state.payroll[index] = action.payload;
            }
        }
    }
})

export const { setLoading, setPayroll, setSearchPayrollByName, setSelectedPayroll, addPayroll, updatePayroll } = payrollSlice.actions;
export default payrollSlice.reducer;