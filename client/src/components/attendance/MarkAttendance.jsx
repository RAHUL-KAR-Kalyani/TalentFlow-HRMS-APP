import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { addAttendance } from '../../redux/attendanceSlice';
import { ATTENDANCE_ENDPOINT } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

const MarkAttendance = () => {
    useEffect(() => {
        document.title = "Mark Attendance"
    }, []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { attendances } = useSelector(store => store.attendance);
    const { employees, searchEmployeeByName } = useSelector(store => store.employee);

    const loggedInEmployee = employees.find(emp => emp.email === user.email);

    const empid = loggedInEmployee?._id;
    // console.log(empid, 'empid of logged in employee');

    // console.log(employees.map(emp => emp.email), 'all emails of empoyeees')
    if (!loggedInEmployee) {
        // console.error('No employee found with the given email:', user.email);
    } else {
        // console.log(loggedInEmployee, 'loggedInEmployee');
    }

    const [input, setInput] = useState({
        employee: "",
        name: "",
        email: "",
        date: new Date().toLocaleDateString('en-CA'),
        status: ""
    });

    useEffect(() => {
        if (loggedInEmployee && user) {
            setInput(prev => ({
                ...prev,
                employee: loggedInEmployee._id,
                name: user.name,
                email: loggedInEmployee.email
            }));
        }
    }, [loggedInEmployee, user]);

    const [loading, setloading] = useState(false);
    // const [message, setMessage] = useState('');

    const handleChange = (e) => {
        // setInput({ ...input, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_ATTENDANCE_ENDPOINT}/mark-attendance`, input, { withCredentials: true });
            // console.log(response.data);
            // console.log(response.data.success);
            // console.log(response.data.employee);
            if (response.data.success) {
                dispatch(addAttendance(response.data.employee));
                navigate('/attendance');
                toast.success(response.data.message);
                // setMessage(response.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to add employee. Please try again.");
        }
    }



    return (
        <div className='flex justify-center min-h-screen bg-gray-100 p-2'>


            <form className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-full" onSubmit={submitHandler}>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Mark Attendance</h2>

                <div>
                    <div className="w-full sm:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="employee" value={input.employee} readOnly placeholder="Employee ID" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition" required />
                    </div>
                    <div className="w-full sm:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="name" value={input.name} readOnly placeholder="Employee Name" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition" required />
                    </div>
                    <div className="w-full sm:grid-cols-2 gap-4 mb-4">
                        <input type="email" name="email" value={input.email} readOnly placeholder="Employee Email" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition" required />
                    </div>
                    <div className="w-full sm:grid-cols-2 gap-4 mb-4">
                        <input type="date" value={input.date} readOnly name="date" placeholder="Attendance Date" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition" required />
                    </div>
                    <div className='w-full sm:grid-cols-2 gap-4 mb-4'>
                        <select name='status' onChange={handleChange} className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition'>
                            <option>Change Status</option>
                            <option value="Present">Present</option>
                            <option value="Leave">Leave</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Submit</button>
            </form>
        </div>
    )
}

export default MarkAttendance