import React, { useEffect, useState } from 'react'
import useGetAllEmployees from '../../hooks/useGetAllEmployees';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PAYROLL_ENDPOINT } from '../../utils/constant';
import { addPayroll } from '../../redux/payrollSlice';
import { toast } from 'sonner';

const CreatePayroll = () => {
    useEffect(() => {
        document.title = "Create Payroll";
    }, []);

    // ensure employees are loaded
    useGetAllEmployees();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { employees } = useSelector(store => store.employee);

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        employeeId: "",
        month: "",
        year: new Date().getFullYear()
    });

    const months = [
        { label: 'January', value: 'Jan' },
        { label: 'February', value: 'Feb' },
        { label: 'March', value: 'Mar' },
        { label: 'April', value: 'Apr' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'Jun' },
        { label: 'July', value: 'Jul' },
        { label: 'August', value: 'Aug' },
        { label: 'September', value: 'Sep' },
        { label: 'October', value: 'Oct' },
        { label: 'November', value: 'Nov' },
        { label: 'December', value: 'Dec' }
    ];
    // const designationFont = selectedPayroll?.employee?.designation === 'ceo' ? 'uppercase' : 'null';

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();       

        setLoading(true);
        try {
            const payload = {
                employeeId: input.employeeId,
                month: input.month,
                year: input.year
            };

            const response = await axios.post(`${import.meta.env.VITE_PAYROLL_ENDPOINT}/generate`, payload, { withCredentials: true });
            if (response.data.success) {
                // server returns created payroll in response.data.payroll
                dispatch(addPayroll(response.data.payroll));
                toast.success(response.data.message || 'Payroll generated');
                navigate('/payroll');
            }
        } catch (error) {
            // console.error(error);
            toast.error(error.response?.data?.message || 'Failed to generate payroll');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center min-h-screen bg-gray-100 p-2'>
            <form className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-2/3" onSubmit={submitHandler}>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Generate Payroll</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <select name="employeeId" value={input.employeeId} onChange={changeEventHandler} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-700" required>
                        <option value="">Select Employee</option>
                        {Array.isArray(employees) && employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name} — <span className={`ms-4 ${emp.designation === 'ceo' ? 'uppercase' : 'capitalize'}`}>{emp.designation}</span>
                            </option>
                        ))}
                    </select>

                    <select name="month" value={input.month} onChange={changeEventHandler} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-700" >
                        <option value="">Select Month</option>
                        {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </div>

                <div className="grid mb-4">
                    <input type="number" name="year" value={input.year} onChange={changeEventHandler} placeholder="Year" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
                </div>

                <div className="mt-6">
                    <button type="submit" className="w-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-purple-500 hover:to-indigo-500 transition duration-300">
                        {loading ? "Please wait..." : "Generate Payroll"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePayroll