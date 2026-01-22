import { createSlice } from "@reduxjs/toolkit";

const leaveSlice = createSlice({
    name: 'leave',
    initialState: {
        loading: false,
        leaveRequests: [],
        searchLeaveByName: '',
        selectedLeave: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setLeaveRequests: (state, action) => {
            state.leaveRequests = action.payload
        },
        setSearchLeaveByName: (state, action) => {
            state.searchLeaveByName = action.payload
        },
        setSelectedLeave: (state, action) => {
            state.selectedLeave = action.payload
        },
        addLeaveRequest: (state, action) => {
            state.leaveRequests.push(action.payload)
        },
        updateLeaveRequest: (state, action) => {
            const index = state.leaveRequests.findIndex(leave => leave._id === action.payload._id)
            if (index !== -1) {
                state.leaveRequests[index] = action.payload
            }
        }
    }
});

export const { setLoading, setLeaveRequests, setSearchLeaveByName, setSelectedLeave, addLeaveRequest, updateLeaveRequest } = leaveSlice.actions;
export default leaveSlice.reducer;