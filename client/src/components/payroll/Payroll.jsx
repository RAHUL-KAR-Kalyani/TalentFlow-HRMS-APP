import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PayrollTable from './PayrollTable'
import { RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PAYROLL_ENDPOINT } from '../../utils/constant';
import { setPayroll, setSearchPayrollByName } from '../../redux/payrollSlice';
import useGetAllPayroll from '../../hooks/useGetAllPayroll';
import axios from 'axios';
import { toast } from 'sonner';

const Payroll = () => {
    useGetAllPayroll();
    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);

    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'admin' || role === 'hr';

    useEffect(() => {
        document.title = "Payroll"
    }, []);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [message, setMessage] = useState('')
    const [spinning, setSpinning] = useState(false);
    const [input, setInput] = useState('');

    useEffect(() => {
        dispatch(setSearchPayrollByName(input))
    }, [input])

    const handleClick = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 1000);
        // console.log('not spinning now');
    };

    const refreshPage = async () => {
        try {
            setSpinning(true); // start spinning
            let response;
            // console.log(import.meta.env.MODE, "mode")

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
                // console.log(response.data, 'payroll data found');
                dispatch(setPayroll(response.data.payroll));
                setTimeout(() => setSpinning(false), 300);
                // console.log(response.data.message, 'message from payroll');
                toast.success(response?.data?.message);
            }
            // setSpinning(true);
            // setTimeout(() => setSpinning(false), 1000);
            // console.log('not spinning now');
        } catch (error) {
            // console.error('Error fetching employees:', error);
            toast.error(error.response?.data?.message)
        } finally {
            setSpinning(false); // stop spinning
        }
    }


    return (
        <div className='min-w-60'>
            <div className="flex flex-col gap-4">
                {user.role === 'Employee' ? <h1 className='text-2xl font-semibold mb-4 text-center'>My Payroll</h1> : <h1 className='text-2xl font-semibold mb-4 text-center'>Payroll Management</h1>}

                {user.role !== 'Employee' ?
                    <div className="flex items-center gap-3">
                        <input type="text" className='p-2 outline-none border-2 border-gray-200 bg-white' placeholder='Search By Name' onChange={(e) => setInput(e.target.value)} />
                        <button onClick={() => navigate('/payroll/generate-payroll')} className='bg-gray-700 text-white text-center p-2 hover:cursor-pointer'>Generate Payroll</button>

                        <button onClick={() => refreshPage(dispatch)} className='flex items-center bg-gray-700 text-white text-center p-2 gap-3 hover:cursor-pointer'>
                            <RefreshCcw size={20} className={`cursor-pointer transition-transform ${spinning ? "animate-spin" : ""}`} onClick={handleClick} />
                            Refresh
                        </button>
                    </div> :
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => refreshPage(dispatch)} className='flex items-center bg-gray-700 text-white text-center p-2 gap-3 hover:cursor-pointer'>
                            <RefreshCcw size={20} className={`cursor-pointer transition-transform ${spinning ? "animate-spin" : ""}`} onClick={handleClick} />
                            Refresh
                        </button>
                    </div>
                }
                <PayrollTable />
            </div>
        </div>
    )
}

export default Payroll