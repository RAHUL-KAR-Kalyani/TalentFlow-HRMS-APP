import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Users, IndianRupee, FileClock, FileCheck, FileX, Clock } from 'lucide-react'

import useGetAllEmployees from '../hooks/useGetAllEmployees'
import useGetAllLeave from '../hooks/useGetAllLeave'
import useGetAllAttendance from '../hooks/useGetAllAttendance'
import useGetAllPayroll from '../hooks/useGetAllPayroll'
import StatCard from '../components/extra/StatCard'

const AdminDashboard = () => {
    useGetAllEmployees()
    useGetAllLeave()
    useGetAllAttendance()
    useGetAllPayroll()

    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    const { employees = [] } = useSelector(store => store.employee)
    const { leaveRequests = [] } = useSelector(store => store.leave)
    const { attendances = [] } = useSelector(store => store.attendance)
    const { payroll = [] } = useSelector(store => store.payroll)

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const employeesEligible = employees.filter(
        e => (e.role).toLowerCase() === 'employee'
    )

    const stats = useMemo(() => {
        const payrollGeneratedThisMonth = payroll.filter(
            p => Number(p.month) === currentMonth && Number(p.year) === currentYear
        ).length

        return {
            totalEmployees: employees.length,
            employeesEligible: employeesEligible.length,

            totalLeaves: leaveRequests.length,
            pendingLeaves: leaveRequests.filter(l => l.status === 'Pending').length,
            approvedLeaves: leaveRequests.filter(l => l.status === 'Approved').length,
            rejectedLeaves: leaveRequests.filter(l => l.status === 'Rejected').length,

            totalAttendance: attendances.length,
            present: attendances.filter(a => a.status === 'Present').length,
            absent: attendances.filter(a => a.status === 'Absent').length,
            leave: attendances.filter(a => a.status === 'Leave').length,

            totalPayroll: payroll.length,
            payrollThisMonth: payrollGeneratedThisMonth,
            pendingPayroll: employees.length - payrollGeneratedThisMonth
        }
    }, [
        employees,
        leaveRequests,
        attendances,
        payroll,
        employeesEligible,
        currentMonth,
        currentYear
    ])

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mb-8 flex mx-auto justify-center">
                <h1 className="text-3xl font-bold text-gray-800 ">
                    Admin/HR Dashboard
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users />} color="slate" />
                <StatCard title="Employees" value={stats.employeesEligible} subtitle="Role: Employee" icon={<Users />} color="indigo" />
                <StatCard title="Payroll Generated" value={stats.totalPayroll} subtitle="All time" icon={<IndianRupee />} color="emerald" />
                <StatCard title={`Payroll (This Month)`} value={stats.payrollThisMonth} subtitle={`Pending: ${stats.pendingPayroll}`} icon={<IndianRupee />} color="emerald" />
                <StatCard title="Pending Payroll (This Month)" value={stats.pendingPayroll} icon={<IndianRupee />} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Leave Summary */}
                <section className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Leave Summary
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard title="Total Requests" value={stats.totalLeaves} icon={<FileClock />} color="slate" />
                        <StatCard title="Pending" value={stats.pendingLeaves} icon={<FileClock />} color="amber" />
                        <StatCard title="Approved" value={stats.approvedLeaves} icon={<FileCheck />} color="green" />
                        <StatCard title="Rejected" value={stats.rejectedLeaves} icon={<FileX />} color="red" />
                    </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Attendance Summary
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard title="Total Records" value={stats.totalAttendance} icon={<Clock />} color="slate" />
                        <StatCard title="Present" value={stats.present} icon={<Clock />} color="green" />
                        <StatCard title="Absent" value={stats.absent} icon={<Clock />} color="red" />
                        <StatCard title="On Leave" value={stats.leave} icon={<Clock />} color="amber" />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AdminDashboard
