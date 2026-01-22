import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        loading: false,
        attendances: [],
        searchAttendanceByName: '',
        selectedAttendance: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAttendance: (state, action) => {
            state.attendances = action.payload;
        },
        setSearchAttendanceByName: (state, action) => {
            state.searchAttendanceByName = action.payload;
        },
        setSelectedAttendance: (state, action) => {
            state.selectedAttendance = action.payload;
        },
        addAttendance: (state, action) => {
            state.attendances.push(action.payload);
        },
        updateAttendance: (state, action) => {
            const index = state.attendances.findIndex(att => att._id === action.payload._id);
            if (index !== -1) {
                state.attendances[index] = action.payload;
            }
        }
    }
});

export const { setLoading, setAttendance, setSearchAttendanceByName, setSelectedAttendance, addAttendance, updateAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;