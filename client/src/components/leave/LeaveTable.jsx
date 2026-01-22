import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useGetAllLeave from '../../hooks/useGetAllLeave';
import { toast } from 'sonner';
import { updateLeaveRequest } from '../../redux/leaveSlice';
import axios from 'axios';
import { LEAVE_ENDPOINT } from '../../utils/constant';

const LeaveTable = () => {
    useGetAllLeave();
    // useEffect(() => {
    // }, []);
    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((store) => store.auth);
    const { leaveRequests = [], searchLeaveByName } = useSelector(store => store.leave);
    // console.log('leaveRequests data in table:', leaveRequests);
    const [filterLeave, setFilterLeave] = useState(leaveRequests);
    const isEmployee = user?.role === 'Employee';

    useEffect(() => {
        if (!Array.isArray(leaveRequests)) {
            setFilterLeave([]);
            return;
        }

        // if (!leaveRequests) return;
        const filteredLeaves = leaveRequests.filter((leave) => {
            if (!searchLeaveByName) {
                return true;
            }
            return leave.employee?.name?.toLowerCase().includes(searchLeaveByName.toLowerCase());
        });
        setFilterLeave(filteredLeaves);
    }, [leaveRequests, searchLeaveByName]);


    const updateLeaveHandler = async (leaveId, newStatus) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_LEAVE_ENDPOINT}/update-leave-request/${leaveId}`, { status: newStatus }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message, 'Leave status updated successfully');
                // console.log(response.data.updatedLeaveRequest)
                dispatch(updateLeaveRequest(response.data.updatedLeaveRequest));
            }
        } catch (error) {
            // console.log(error);
            // console.log(error.response);
            toast.error(error.response?.data?.message);
        }
    };    

    return (
        <div className='overflow-x-auto min-w-60'>
            <table className='min-w-full divide-y divide-gray-200 border border-gray-200 shadow-sm'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Id</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>name</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>department</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>designation</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>leave start date</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>leave end date</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>leave type</th>
                        <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>status</th>
                    </tr>
                </thead>

                <tbody className='bg-white divide-y divide-gray-200'>
                    {filterLeave && filterLeave.length > 0 ? (
                        filterLeave.map((leave) => (
                            <tr key={leave._id} className='hover:bg-gray-100 transition-colors capitalize'>
                                <td className='px-4 py-2 text-sm text-gray-700'>{leave.employee?._id || 'employee left'}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{leave.employee?.name || 'employee left'}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{leave.employee?.department || 'employee left'}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{leave.employee?.designation || 'employee left'}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{new Date(leave.startDate).toLocaleDateString('en-GB')}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{new Date(leave.endDate).toLocaleDateString('en-GB')}</td>
                                <td className='px-4 py-2 text-sm text-gray-700 capitalize font-semibold'>{leave.type}</td>
                                {/* <td className='px-4 py-2 text-sm text-gray-700'>{leave.status}</td> */}
                                {!isEmployee ? (
                                    <td className='px-4 py-2 text-center text-sm text-gray-700'>
                                        {/* {console.log(leave)} */}
                                        <select value={leave.status} onChange={(e) => updateLeaveHandler(leave._id, e.target.value)} className='border border-gray-200 rounded px-2 py-1 text-sm outline-none'>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                ) : (
                                    <td className='px-4 py-2 text-center text-sm text-gray-700'>{leave.status}</td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className='px-4 py-2 text-sm text-gray-700 text-center'>No leave requests found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default LeaveTable