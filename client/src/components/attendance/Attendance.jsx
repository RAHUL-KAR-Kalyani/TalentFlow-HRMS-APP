import React, { useEffect, useState } from 'react'
import AttendanceTable, { refreshPage } from './AttendanceTable'
import useGetAllAttendance from '../../hooks/useGetAllAttendance';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCcw } from 'lucide-react';
import { setAttendance, setSearchAttendanceByName } from '../../redux/attendanceSlice';
import { ATTENDANCE_ENDPOINT } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'sonner';

const Attendance = () => {
    useEffect(() => {
        document.title = "Attendance"
    }, []);

    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);
    const [message, setMessage] = useState('')

    const [spinning, setSpinning] = useState(false);

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
                // console.warn('No matching employee record found for logged-in user');
                return;
            }
            const response = user && (user.role === 'Admin' || user.role === 'HR')
                ? await axios.get(`${import.meta.env.VITE_ATTENDANCE_ENDPOINT}/get-attendance-for-admin-hr`, { withCredentials: true })
                : await axios.get(`${import.meta.env.VITE_ATTENDANCE_ENDPOINT}/get-attendance-by-employee/${matchingEmployee._id}`, { withCredentials: true });
            // console.log(response.data);
            // console.log('attendance data found');
            // console.log(response.data.success);
            
            if (response.data.success) {
                dispatch(setAttendance(response.data.attendance));
                setTimeout(() => setSpinning(false), 300);
                // console.log(response.data.message,'message from attendance');
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

    useGetAllAttendance();
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchAttendanceByName(input))
    }, [input])

    return (
        <div className='min-w-60'>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <input type="text" className='p-2 outline-none border-2 border-gray-200 bg-white' placeholder='Search By Name' onChange={(e) => setInput(e.target.value)} />
                    <button onClick={() => navigate('/attendance/mark-attendance')} className='bg-gray-700 text-white text-center p-2 hover:cursor-pointer'>Mark Attendance</button>

                    <button onClick={() => refreshPage(dispatch)} className='flex items-center bg-gray-700 text-white text-center p-2 gap-3 hover:cursor-pointer'>
                        <RefreshCcw size={20} className={`cursor-pointer transition-transform ${spinning ? "animate-spin" : ""}`} onClick={handleClick} />
                        Refresh
                    </button>
                </div>
                <AttendanceTable />
            </div>
        </div>
    )
}

export default Attendance