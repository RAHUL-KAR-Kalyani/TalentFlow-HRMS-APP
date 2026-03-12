import React, { useEffect, useState } from 'react'
import useGetAllEmployees from '../../hooks/useGetAllEmployees';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCcw } from 'lucide-react';
import { EMPLOYEE_ENDPOINT } from '../../utils/constant';
import { setEmployees } from '../../redux/employeeSlice';
import EmployeeTable, { refreshPage } from './EmployeeTable';
import { setSearchEmployeeByName } from '../../redux/employeeSlice';
import axios from 'axios';
import { toast } from 'sonner';


const Employee = () => {
    useEffect(() => {
        document.title = "Employees"
    }, []);
    const [message, setMessage] = useState('')
    const { user } = useSelector((store) => store.auth);
    const { employees } = useSelector(store => store.employee);

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
            const response = await axios.get(`${import.meta.env.VITE_EMPLOYEE_ENDPOINT}/get-employees`, { withCredentials: true });
            // const response = user && user.role === 'Admin'
            //     ? await axios.get(`${import.meta.env.VITE_ATTENDANCE_ENDPOINT}/get-employees`, { withCredentials: true })
            //     : await axios.get(`${import.meta.env.VITE_EMPLOYEE_ENDPOINT}/get-employee/${matchingEmployee?._id}`, { withCredentials: true });
            // console.log(response.data);
            // console.log(response.data.success);
            if (response.data.success) {
                dispatch(setEmployees(response.data.employees));
                setTimeout(() => setSpinning(false), 300);
                // console.log(response.data.message, 'message from employee');
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

    useGetAllEmployees();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchEmployeeByName(input))
    }, [input])



    return (
        <div className='min-w-60'>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <input type="text" className='p-2 outline-none border-2 border-gray-200 bg-white' placeholder='Search Employee' onChange={(e) => setInput(e.target.value)} />
                    <button onClick={() => navigate('/employees/add-employee')} className='bg-gray-700 text-white text-center p-2 hover:cursor-pointer'>Add Employee</button>

                    <button onClick={() => refreshPage()} className='flex items-center bg-gray-700 text-white text-center p-2 gap-3 hover:cursor-pointer'>
                        <RefreshCcw size={20} className={`cursor-pointer transition-transform ${spinning ? "animate-spin" : ""}`} onClick={handleClick} />
                        Refresh
                    </button>
                </div>
                <EmployeeTable />
            </div>
        </div>

    )
}

export default Employee