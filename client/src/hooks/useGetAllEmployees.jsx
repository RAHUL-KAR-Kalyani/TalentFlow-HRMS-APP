import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { EMPLOYEE_ENDPOINT } from '../utils/constant';
import { setEmployees } from '../redux/employeeSlice';
import { toast } from 'sonner';

const useGetAllEmployees = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);

    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'admin' || role === 'hr';
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchEmployees = async () => {
            try {

                const response = await axios.get(`${import.meta.env.VITE_EMPLOYEE_ENDPOINT}/get-employees`, { withCredentials: true });
                // console.log(response.data, 'employee data found for employee');
                // console.log(import.meta.env.MODE,"mode")

                // if (!isAdmin) {
                //     // Employee: find the matching employee record by name
                //     const matchingEmployee = employees?.find(
                //         emp => emp.name === user.name
                //     );

                //     if (!matchingEmployee) {
                //         console.warn('No matching employee record found for logged-in user');
                //         return;
                //     }

                //     response = await axios.get(`${EMPLOYEE_ENDPOINT}/get-employees`, { withCredentials: true });
                //     console.log(response.data, 'employee data found for employee');

                // } else {
                //     response = await axios.get(`${EMPLOYEE_ENDPOINT}/get-employees`, { withCredentials: true });
                //     console.log(response.data, 'employee data found for admin/hr');
                // }


                if (response?.data?.success) {
                    // console.log(response.data, 'employee data found');
                    dispatch(setEmployees(response.data.employees));
                }
            } catch (error) {
                // console.error('Error fetching employees:', error);
                toast.error(error.response?.data?.message)
            }
        }
        fetchEmployees();
    }, [])
}

export default useGetAllEmployees