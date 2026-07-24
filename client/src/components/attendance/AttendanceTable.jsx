import axios from 'axios';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { ATTENDANCE_ENDPOINT } from '../../utils/constant';
import { setAttendance, updateAttendance } from '../../redux/attendanceSlice';


export const refreshPage = async (dispatch) => {
    try {
        const response = await axios.get(`${ATTENDANCE_ENDPOINT}/get-attendance`, { withCredentials: true });
        // console.log(response.data);
        // console.log(response.data.success);
        if (response?.data?.success) {
            dispatch(setAttendance(response?.data?.attendance));
            toast.success(response?.data?.message);
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error(error.response?.data?.message);
    }
}

const AttendanceTable = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((store) => store.auth);

    const { attendances, searchAttendanceByName } = useSelector(store => store.attendance);
    const [filterAttendance, setFilterAttendance] = useState(attendances);
    const [expandedDates, setExpandedDates] = useState({});
    const isEmployee = user?.role === 'Employee';

    useEffect(() => {
        if (!attendances) return;

        const filteredAttendances = attendances.filter((attendance) => {
            if (!searchAttendanceByName) {
                return true;
            }
            return attendance.employee?.name?.toLowerCase().includes(searchAttendanceByName.toLowerCase());
        });
        setFilterAttendance(filteredAttendances);
    }, [attendances, searchAttendanceByName]);

    const toggleDate = (date) => {
        setExpandedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };


    const groupedByDate = filterAttendance?.reduce((acc, attendance) => {
        const dateKey = new Date(attendance?.date).toLocaleDateString();

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(attendance);
        return acc;
    }, {});


    const updateAttendanceHandler = async (attendanceId, newStatus) => {
        try {
            const response = await axios.patch(
                `${ATTENDANCE_ENDPOINT}/update-attendance/${attendanceId}`,
                { status: newStatus },
                { withCredentials: true }
            );

            if (response?.data?.success) {
                toast.success(response?.data?.message);
                dispatch(updateAttendance(response?.data?.attendance));
            }
        } catch (error) {
            // console.log(error)
            // console.log(error?.response)
            toast.error(error?.response?.data?.message || "Failed to update attendance");
        }
    };



    return (
        <div className='overflow-x-auto min-w-60'>
            <table className='min-w-full divide-y divide-gray-200 border border-gray-200 shadow-sm'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Id</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>name</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>email</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>department</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>designation</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>date</th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>status</th>
                    </tr>
                </thead>

                {/* without date grouping */}

                {/* <tbody className='bg-white divide-y divide-gray-200'>
                    {
                        filterAttendance?.map((attendance) => (
                            <tr key={attendance._id} className='hover:bg-gray-100 transition-colors'>
                                <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{attendance.employee?._id || 'employee left'}</td>
                                <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{attendance.employee?.name || 'employee left'}</td>
                                <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{attendance.employee?.email || 'employee left'}</td>
                                <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{attendance.employee?.department || 'employee left'}</td>
                                <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{attendance.employee?.designation || 'employee left'}</td>
                                <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>{new Date(attendance.date).toLocaleDateString()}</td>

                                {!isEmployee ? (
                                    <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>
                                        <select value={attendance.status} onChange={(e) => updateAttendanceHandler(attendance._id, e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-sm outline-none" >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Leave">Leave</option>
                                        </select>
                                    </td>
                                ) : (
                                    <td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700'>
                                        {attendance.status}
                                    </td>
                                )}
                            </tr>
                        ))


                    }
                </tbody> */}

                {/* with date grouping */}

                {/* <tbody className='bg-white divide-y divide-gray-200'> */}
                    {Object.entries(groupedByDate || {}).map(([date, records]) => (
                        <tbody key={date} className='bg-white divide-y divide-gray-200'>
                            <tr className='bg-gray-100 font-medium'>
                                <td colSpan={7} className='px-4 py-2 text-sm text-gray-700'>
                                    <button onClick={() => toggleDate(date)} className='flex items-center gap-2 text-sm font-semibold text-gray-700' >
                                        {expandedDates[date] ? '-' : '+'} {new Date(date).toLocaleDateString('en-GB')}
                                    </button>
                                </td>
                            </tr>

                            {expandedDates[date] &&
                                records.map(attendance => (
                                    <tr key={attendance?._id} className='hover:bg-gray-50'>
                                        <td className='px-4 py-2 text-sm text-gray-700'>
                                            {attendance?.employee?._id || 'Employee Left'}
                                        </td>
                                        <td className='px-4 py-2 text-sm text-gray-700'>
                                            {attendance?.employee?.name || 'Employee Left'}
                                        </td>
                                        <td className='px-4 py-2 text-sm text-gray-700'>
                                            {attendance?.employee?.email || 'Employee Left'}
                                        </td>
                                        <td className='px-4 py-2 text-sm text-gray-700'>
                                            {attendance?.employee?.department || 'Employee Left'}
                                        </td>
                                        <td className='px-4 py-2 text-sm text-gray-700'>
                                            {attendance?.employee?.designation || 'Employee Left'}
                                        </td>
                                        <td className='px-4 py-2 text-sm text-gray-700'>
                                            {new Date(attendance?.date).toLocaleDateString('en-GB')}
                                        </td>

                                        {!isEmployee ? (
                                            <td className='px-4 py-2 text-sm text-gray-700'>
                                                <select value={attendance?.status} onChange={(e) => updateAttendanceHandler(attendance?._id, e.target.value)} className='border border-gray-200 rounded px-2 py-1 text-sm outline-none'>
                                                    <option value="Present">Present</option>
                                                    <option value="Absent">Absent</option>
                                                    <option value="Leave">Leave</option>
                                                </select>
                                            </td>
                                        ) : (
                                            <td className='px-4 py-2 text-sm text-gray-700'>{attendance?.status}</td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    ))}
                {/* </tbody> */}
            </table>
        </div>
    )
}

export default AttendanceTable