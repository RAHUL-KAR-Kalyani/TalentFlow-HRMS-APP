import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_ENDPOINT } from '../../utils/constant';
import axios from 'axios';
import { deleteEmployee, setEmployees, updateEmployee } from '../../redux/employeeSlice';
import { toast } from 'sonner';
import { Pen, Trash2 } from 'lucide-react';


export const refreshPage = async (dispatch) => {
    try {
        const response = await axios.get(`${EMPLOYEE_ENDPOINT}/get-employees`, { withCredentials: true });        
        if (response.data.success) {
            dispatch(setEmployees(response.data.employees))
            toast.success(response?.data?.message);
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error(error.response?.data?.message)
    }
}

const EmployeeTable = () => {
    const { user } = useSelector((store) => store.auth);
    const { employees, searchEmployeeByName } = useSelector(store => store.employee);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [filterEmployee, setFilterEmployee] = useState(employees);
    useEffect(() => {
        if (!employees) return;
        const filteredEmployees = employees.filter((employee) => {
            if (!searchEmployeeByName) {
                return true;
            }
            return employee?.name?.toLowerCase().includes(searchEmployeeByName.toLowerCase());
        })
        setFilterEmployee(filteredEmployees);
    }, [employees, searchEmployeeByName]);

    const refreshPage = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_EMPLOYEE_ENDPOINT}/get-employees`, { withCredentials: true });
            
            if (response.data.success) {
                dispatch(setEmployees(response.data.employees));
                toast.success(response?.data?.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    }


    const deleteEmployeeHandler = async (id) => {
        console.log(`clicked for delete`)
        try {
            const response = await axios.delete(`${import.meta.env.VITE_EMPLOYEE_ENDPOINT}/delete-employee/${id}`, { withCredentials: true });            
            if (response.data.success) {
                dispatch(deleteEmployee({ _id: id }));
                refreshPage();
                toast.success(response?.data?.message);
                alert("Employee deleted successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    }

    const updateEmployeeHandler = async (id) => {
        navigate(`/employees/update-employee/${id}`);
    }

    return (
        <div className='overflow-x-auto min-w-60 bg-transparent'>
            <table className='min-w-full divide-y divide-gray-200 border border-gray-200 shadow-sm'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>name</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>email</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>department</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>designation</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>role</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Employement Type</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>salary</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>joining Date</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>manage</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {filterEmployee?.map((employee) => (
                        <tr key={employee._id} className='hover:bg-gray-100 transition-colors'>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{employee?.name}</td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{employee?.email}</td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{employee?.department}</td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{employee.designation}</td>
                            <td className={`px-4 py-2 ${employee?.role?.toLowerCase() === 'hr' ? 'uppercase' : 'capitalize'} whitespace-nowrap text-sm text-gray-700`}>{employee?.role}</td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{employee.employment_type}</td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{(employee?.salary / 100000)} LPA</td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>
                                {(() => {
                                    const employeeJoiningDate = new Date(employee?.joiningDate);

                                    const day = String(employeeJoiningDate.getDate()).padStart(2, '0');
                                    const month = String(employeeJoiningDate.getMonth() + 1).padStart(2, '0');
                                    const year = employeeJoiningDate.getFullYear();

                                    const formattedDate = `${day}/${month}/${year}`;
                                    return formattedDate;
                                })()}
                            </td>
                            <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700 flex gap-6'>
                                <div className='relative'>
                                    <Trash2 size={20} className='hover:cursor-pointer' onClick={() => deleteEmployeeHandler(employee?._id)} />
                                </div>
                                <div className='relative'>
                                    <Pen size={20} className='hover:cursor-pointer' onClick={() => updateEmployeeHandler(employee?._id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeTable