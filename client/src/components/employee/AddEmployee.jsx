import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { EMPLOYEE_ENDPOINT } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../../redux/employeeSlice';
import { toast } from 'sonner';

const AddEmployee = () => {
    useEffect(() => {
        document.title = "Add Employee"
    }, []);

    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [input, setInput] = useState({
        name: "",
        email: "",
        department: "",
        designation:"",
        role: user.role,
        employment_type: "Permanent",
        joiningDate: "",
        salary: ""
    })

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_EMPLOYEE_ENDPOINT}/register`, input, { withCredentials: true });
            console.log(response.data);
            console.log(response.data.success);
            console.log(response.data.employee);
            if (response.data.success) {
                dispatch(addEmployee(response.data.employee));
                navigate('/employees');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to add employee. Please try again.");
        }
    }


    return (
        <div className='flex justify-center min-h-screen bg-gray-100 p-2'>
            <form className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-full" onSubmit={submitHandler}>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Add New Employee
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input type="text" name="id" value={input.id} onChange={changeEventHandler} placeholder="Employee ID" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    <input type="text" name="name" value={input.name} onChange={changeEventHandler} placeholder="Employee Name" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Employee Email" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"  />
                    <input type="text" name="department" value={input.department} onChange={changeEventHandler} placeholder="Employee Department" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input type="text" name="designation" value={input.designation} onChange={changeEventHandler} placeholder="Employee Designation" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"  />
                    {/* <input type="text" name="role" value={input.role} onChange={changeEventHandler} placeholder="Employee Role" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required /> */}
                    <select name="role" value={input.role} onChange={changeEventHandler} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-500">
                        <option value="">Select Role</option>
                        <option value="admin" disabled>Admin</option>
                        <option value="hr">HR</option>
                        <option value="employee">Employee</option>
                    </select>

                    {/* <input type="number" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="Employee Salary" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required /> */}
                </div>

                <div className="grid mb-4">
                    <input type="number" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="Employee Salary" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <select name="employment_type" value={input.employment_type} onChange={changeEventHandler} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-500"  >
                        <option>
                            Select Employment Type
                        </option>
                        <option value="Permanent">Permanent</option>
                        <option value="Intern">Intern</option>
                    </select>
                    <input type="date" name="joiningDate" value={input.joiningDate} onChange={changeEventHandler} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>

                <div className="mt-6">
                    <button type="submit" className="w-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-purple-500 hover:to-indigo-500 transition duration-300">
                        {"Add Employee"}
                    </button>
                </div>
            </form>

        </div >
    )
}

export default AddEmployee