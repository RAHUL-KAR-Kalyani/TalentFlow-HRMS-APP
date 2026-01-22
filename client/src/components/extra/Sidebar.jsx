import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ open, setOpen }) => {
    const { user } = useSelector((store) => store.auth)
    const location = useLocation()

    const adminMenuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Attendance", path: "/attendance" },
        { name: "Employees", path: "/employees" },
        { name: "Leave", path: "/leave" },
        { name: "Payroll", path: "/payroll" },
        { name: "Profile", path: "/profile" },
    ]

    const employeeMenuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Attendance", path: "/attendance" },
        { name: "Leave", path: "/leave" },
        { name: "Payroll", path: "/payroll" },
        { name: "Profile", path: "/profile" },
    ]

    const menuItems =
        user?.role !== 'Employee' ? adminMenuItems : employeeMenuItems

    return (
        <aside
            className={`
                fixed top-0 left-0 z-40 h-screen
                w-64
                bg-linear-to-b from-gray-900 via-gray-900 to-gray-800
                text-white
                transition-transform duration-300
                ${open ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}
        >
            {/* Logo / App Name */}
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <h1 className="text-lg font-semibold tracking-wide">
                    HMS
                </h1>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={`
                                flex items-center gap-3
                                px-4 py-3 rounded-xl
                                text-sm font-medium
                                transition-all
                                ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }
                            `}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar
