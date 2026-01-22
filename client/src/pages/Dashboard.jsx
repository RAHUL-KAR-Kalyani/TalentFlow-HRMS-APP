import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Users, IndianRupee, FileClock, FileCheck, FileX, Clock } from 'lucide-react'

import useGetAllEmployees from '../hooks/useGetAllEmployees'
import useGetAllLeave from '../hooks/useGetAllLeave'
import useGetAllAttendance from '../hooks/useGetAllAttendance'
import useGetAllPayroll from '../hooks/useGetAllPayroll'
import StatCard from '../components/extra/StatCard'

const Dashboard = () => {
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    // fetch data (hooks already scope for admin vs employee)
    useGetAllEmployees();
    useGetAllLeave();
    useGetAllAttendance();
    useGetAllPayroll();

    const { employees = [] } = useSelector(store => store.employee)
    const { leaveRequests = [] } = useSelector(store => store.leave)
    const { attendances = [] } = useSelector(store => store.attendance)
    const { payroll = [] } = useSelector(store => store.payroll)
    const { user } = useSelector(store => store.auth)

    const currentEmployee = employees.find(
        emp => emp.name === user?.name
    )

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const stats = useMemo(() => {
        const payrollThisMonth = payroll.filter(
            p => Number(p.month) === currentMonth && Number(p.year) === currentYear
        ).length

        // only count attendance records for the current month
        const attendanceThisMonth = attendances.filter(a => {
            if (!a.date) return false;
            const d = new Date(a.date);
            return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
        });

        return {
            totalLeaves: leaveRequests.length,
            pendingLeaves: leaveRequests.filter(l => l.status === 'Pending').length,
            approvedLeaves: leaveRequests.filter(l => l.status === 'Approved').length,
            rejectedLeaves: leaveRequests.filter(l => l.status === 'Rejected').length,

            // month-scoped attendance numbers
            totalAttendance: attendanceThisMonth.length,
            present: attendanceThisMonth.filter(a => a.status === 'Present').length,
            absent: attendanceThisMonth.filter(a => a.status === 'Absent').length,
            leave: attendanceThisMonth.filter(a => a.status === 'Leave').length,

            totalPayroll: payroll.length,
            payrollThisMonth
        }
    }, [leaveRequests, attendances, payroll, currentMonth, currentYear])

    return (
        <div className="min-h-auto overflow-x-hidden bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-4 text-white">
                    <h2 className="text-2xl font-bold">Welcome, <span className="font-semibold capitalize">{user?.name}</span></h2>
                    <p className="text-sm mt-1">Here's a quick summary of your profile</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard title="Total Leaves" value={stats.totalLeaves} icon={<FileClock />} color="slate" />
                        <StatCard title="Pending Leaves" value={stats.pendingLeaves} icon={<FileClock />} color="amber" />
                        <StatCard title="Approved Leaves" value={stats.approvedLeaves} icon={<FileCheck />} color="green" />

                        <StatCard title="Total Attendance" value={stats.totalAttendance} icon={<Clock />} color="slate" />
                        <StatCard title="Present" value={stats.present} icon={<Clock />} color="green" />
                        <StatCard title="Absent" value={stats.absent} icon={<Clock />} color="red" />

                        <StatCard title="Payroll Records" value={stats.totalPayroll} icon={<IndianRupee />} color="emerald" />
                        <StatCard title={`Payroll This Month`} value={stats.payrollThisMonth} icon={<IndianRupee />} color="emerald" />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Reusable Info Component */
const Info = ({ label, value, capitalize, uppercase, lowercase }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`font-semibold ${uppercase ? 'uppercase' : lowercase ? 'lowercase' : capitalize ? 'capitalize' : 'capitalize'}`}>
                {value}
            </p>
        </div>
    )
}

export default Dashboard
