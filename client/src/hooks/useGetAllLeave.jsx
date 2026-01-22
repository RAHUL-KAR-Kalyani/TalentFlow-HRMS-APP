import axios from 'axios';
import { toast } from 'sonner';
import React, { useEffect, useRef } from 'react'
import { LEAVE_ENDPOINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaveRequests } from '../redux/leaveSlice';

const useGetAllLeave = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const { leaveRequests } = useSelector((store) => store.leave);
    const { employees } = useSelector(store => store.employee);
    const { user } = useSelector((store) => store.auth);

    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'admin' || role === 'hr';

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const getAllLeaveRequests = async () => {
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

                    response = await axios.get(`${import.meta.env.VITE_LEAVE_ENDPOINT}/get-leave-requests/${matchingEmployee._id}`, { withCredentials: true });
                    // console.log(response.data,'leave data found for employee');

                } else {
                    response = await axios.get(`${import.meta.env.VITE_LEAVE_ENDPOINT}/get-leave-requests`, { withCredentials: true });
                    // console.log(response.data,'leave data found for admin/hr');
                }


                if (response?.data?.success) {
                    dispatch(setLeaveRequests(response.data.leaveRequests));
                }

                // const response = await axios.get(`${LEAVE_ENDPOINT}/get-leave-requests`, { withCredentials: true });
                // console.log(response.data)
                // if (response.data.success) {
                //     // console.log(response.data.leaveRequests,'leave requests fetched');
                //     dispatch(setLeaveRequests(response.data.leaveRequests));
                // }
            } catch (error) {
                // console.error('Error fetching leave requests:', error);
                toast.error(error.response?.data?.message);
            }
        }

        getAllLeaveRequests();
    }, []);
}

export default useGetAllLeave