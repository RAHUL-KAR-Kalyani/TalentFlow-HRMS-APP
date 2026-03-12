import React, { useEffect, useState } from 'react'
import LeaveTable from './LeaveTable'
import { useDispatch, useSelector } from 'react-redux';
import { LEAVE_ENDPOINT } from '../../utils/constant';
import { setLeaveRequests, setSearchLeaveByName } from '../../redux/leaveSlice';
import { useNavigate } from 'react-router-dom';
import useGetAllLeave from '../../hooks/useGetAllLeave';
import { RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const Leave = () => {
    useEffect(() => {
        document.title = "Leave"
    }, []);

    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);
    const { leaveRequest } = useSelector((store) => store.leave);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [input, setInput] = useState('');

    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        dispatch(setSearchLeaveByName(input))
    }, [input])

    const handleClick = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 1000);
    };

    const refreshPage = async () => {
        try {
            setSpinning(true); // start spinning
            const matchingEmployee = employees?.find(
                emp => emp.name === user.name
            );

            if (!matchingEmployee) {
                console.warn('No matching employee record found for logged-in user');
                return;
            }
            // const response = await axios.get(`${import.meta.env.VITE_LEAVE_ENDPOINT}/get-leave-requests/${matchingEmployee._id}`, { withCredentials: true });
            const response = user && (user.role === 'Admin' || user.role === 'HR')
                ? await axios.get(`${import.meta.env.VITE_LEAVE_ENDPOINT}/get-leave-request-for-admin`, { withCredentials: true })
                : await axios.get(`${import.meta.env.VITE_LEAVE_ENDPOINT}/get-leave-requests/${matchingEmployee._id}`, { withCredentials: true });
            // console.log(response.data);
            // console.log('leave data found');
            // console.log(response.data.success);
            if (response.data.success) {
                dispatch(setLeaveRequests(response.data.leaveRequests));
                setTimeout(() => setSpinning(false), 300);
                // console.log(response.data.message,'message from leave');
                // console.log(response.data.message, 'message from attendance');
                toast.success(response?.data?.message);
            }
            else {
                dispatch(setLeaveRequests(response.data.leaveRequests));
                setTimeout(() => setSpinning(false), 300);
                // console.log(response.data.message,'message from leave');
                console.log(response.data.message, 'message from attendance');
                toast.success(response?.data?.message);
            }
        } catch (error) {
            // console.error('Error fetching employees:', error);
            setMessage(error.response?.data?.message)
            // toast.error(error.response?.data?.message);
        } finally {
            setSpinning(false); // stop spinning
        }
    }

    useGetAllLeave();


    return (
        <div className='min-w-60'>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <input type="text" className='p-2 outline-none border-2 border-gray-200 bg-white' placeholder='Search Leave' onChange={(e) => setInput(e.target.value)} />
                    <button onClick={() => navigate('/leave/request-leave')} className='bg-gray-700 text-white text-center p-2 hover:cursor-pointer'>Request Leave</button>

                    <button onClick={() => refreshPage()} className='flex items-center bg-gray-700 text-white text-center p-2 gap-3 hover:cursor-pointer'>
                        <RefreshCcw size={20} className={`cursor-pointer transition-transform ${spinning ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
                <LeaveTable />
            </div>
        </div>
    )
}

export default Leave