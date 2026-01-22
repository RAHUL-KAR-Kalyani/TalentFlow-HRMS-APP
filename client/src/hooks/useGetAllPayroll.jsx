import axios from "axios";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PAYROLL_ENDPOINT } from "../utils/constant";
import { setPayroll } from "../redux/payrollSlice";

const useGetAllPayroll = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);

    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'admin' || role === 'hr';

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        if (!user || !user.role) return;

        const fetchPayroll = async () => {
            try {

                let response;
                // console.log(import.meta.env.MODE,"mode")

                if (!isAdmin) {
                    // Employee: find the matching employee record by name
                    const matchingEmployee = employees?.find(
                        emp => emp.name === user.name
                    );

                    if (!matchingEmployee) {
                        // console.warn('No matching employee record found for logged-in user');
                        return;
                    }

                    response = await axios.get(`${import.meta.env.VITE_PAYROLL_ENDPOINT}/get-payroll/${matchingEmployee._id}`, { withCredentials: true });
                    // console.log(response.data, 'payroll data found for employee');

                } else {
                    response = await axios.get(`${import.meta.env.VITE_PAYROLL_ENDPOINT}/get-payroll`, { withCredentials: true });
                    // console.log(response.data, 'payroll data found for admin/hr');
                }


                if (response?.data?.success) {
                    dispatch(setPayroll(response.data.payroll));
                    // console.log(response.data, 'payroll data found');
                }
            } catch (error) {
                // console.error('Error fetching employees:', error);
                toast.error(error.response?.data?.message)
            }
        }

        fetchPayroll();
    }, [])

}

export default useGetAllPayroll