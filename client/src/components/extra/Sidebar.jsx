import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    CalendarCheck,
    Users,
    FileText,
    Wallet,
    User
} from "lucide-react"

const Sidebar = ({ open, setOpen }) => {
    const { user } = useSelector((store) => store.auth)
    const location = useLocation()

    const adminMenuItems = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Attendance", path: "/attendance", icon: <CalendarCheck size={18} /> },
        { name: "Employees", path: "/employees", icon: <Users size={18} /> },
        { name: "Leave", path: "/leave", icon: <FileText size={18} /> },
        { name: "Payroll", path: "/payroll", icon: <Wallet size={18} /> },
        { name: "Profile", path: "/profile", icon: <User size={18} /> },
    ]

    const employeeMenuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Attendance", path: "/attendance", icon: <CalendarCheck size={18} /> },
        { name: "Leave", path: "/leave", icon: <FileText size={18} /> },
        { name: "Payroll", path: "/payroll", icon: <Wallet size={18} /> },
        { name: "Profile", path: "/profile", icon: <User size={18} /> },
    ]

    const menuItems =
        user?.role !== 'Employee' ? adminMenuItems : employeeMenuItems

    return (
        <aside
            className={`
                fixed top-12 left-0 z-40 h-screen w-64
                backdrop-blur-xl bg-black/80 border-r border-white/10
                text-white transition-transform duration-300
                ${open ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}
        >
            <nav className="px-3 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={`
                                relative flex items-center gap-3
                                px-4 py-3 rounded-xl text-sm font-medium
                                transition-all duration-200 group
                                ${isActive
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }
                            `}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"></span>
                            )}

                            <span className={`${isActive ? "text-indigo-600" : "text-white/70 group-hover:text-white"}`}>
                                {item.icon}
                            </span>

                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar
