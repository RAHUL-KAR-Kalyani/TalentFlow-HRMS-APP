import axios from "axios";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ATTENDANCE_ENDPOINT } from "../utils/constant";
import { setAttendance } from "../redux/attendanceSlice";

const useGetAllAttendance = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);

    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'admin' || role === 'hr';

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        if (!user) return;
        // if (isAdmin && (!employees || employees.length === 0)) return;

        const fetchAttendance = async () => {
            try {
                let response;

                if (!isAdmin) {
                    // Employee: find the matching employee record by name
                    const matchingEmployee = employees?.find(
                        emp => emp.name === user.name
                    );

                    if (!matchingEmployee) {
                        // console.warn('No matching employee record found for logged-in user');
                        return;
                    }
                    response = await axios.get(`${import.meta.env.VITE_ATTENDANCE_ENDPOINT}/get-attendance-by-employee/${matchingEmployee._id}`, { withCredentials: true });
                    // console.log(response?.data?.attendance, 'attendance data found for employee');

                } else {
                    response = await axios.get(`${import.meta.env.VITE_ATTENDANCE_ENDPOINT}/get-attendance-for-admin-hr`, { withCredentials: true });
                    // console.log(response?.data?.attendance, 'attendance data found for admin/hr');
                }


                if (response?.data?.success) {
                    dispatch(setAttendance(response?.data?.attendance));
                }
            } catch (error) {
                // console.error('Error fetching attendance records:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch attendance');
            }
        };

        fetchAttendance();
    }, [user, employees]); // re-run when user or employees change
};

export default useGetAllAttendance;
