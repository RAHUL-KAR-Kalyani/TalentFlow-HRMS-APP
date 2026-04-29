import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LEAVE_ENDPOINT } from '../../utils/constant';
import axios from 'axios';
import { setLeaveRequests } from '../../redux/leaveSlice';
import { toast } from 'sonner';

const AddLeave = () => {
    useEffect(() => {
        document.title = "Add Leave"
    }, []);

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { attendances } = useSelector(store => store.attendance);
    const { employees, searchEmployeeByName } = useSelector(store => store.employee);
    const { leaveRequests, searchLeaveByName } = useSelector(store => store.leave);

    const loggedInEmployee = employees.find(emp => emp.email === user.email);

    const empid = loggedInEmployee?._id;
    // console.log(empid, 'empid of logged in employee');

    // console.log(employees.map(emp => emp.email), 'all emails of empoyeees')
    // if (!loggedInEmployee) {
    //     console.error('No employee found with the given email:', user.email);
    // } else {
    //     console.log(loggedInEmployee, 'loggedInEmployee');
    // }

    const [input, setInput] = useState({
        employee: "",
        name: "",
        email: "",
        type: "",
        startDate: '',
        endDate: ''
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

    const handleChange = (e) => {
        // setInput({ ...input, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_LEAVE_ENDPOINT}/request-leave`, input, { withCredentials: true });
            // console.log(response.data);
            // console.log(response.data.success);
            // console.log(response.data.leaveRequest);
            if (response.data.success) {
                dispatch(setLeaveRequests(response.data.leaveRequest));
                navigate('/leave');
                toast.success(response.data.message);
                // setMessage(response.data.message);
            }
        } catch (error) {
            // console.log(error)
            navigate('/leave');
            toast.error(error.response?.data?.message || "Failed to add leaveRequest. Please try again.");
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
                        <input type="date" value={input.startDate} name="startDate" onChange={handleChange} placeholder="Start Date" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition"  />
                    </div>
                    <div className="w-full sm:grid-cols-2 gap-4 mb-4">
                        <input type="date" value={input.endDate} name="endDate" onChange={handleChange} placeholder="End Date" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition"  />
                    </div>
                    <div className='w-full sm:grid-cols-2 gap-4 mb-4'>
                        <select name='type' onChange={handleChange} className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none transition'>
                            <option>Leave Type</option>
                            <option value="Casual">Casual</option>
                            <option value="Sick">Sick</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Submit</button>
            </form>
        </div>
    )
}

export default AddLeave