import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MainLayout from './MainLayout'
import { useEffect } from 'react'
import Home from './components/extra/Home'
import Profile from './pages/Profile'
import AddEmployee from './components/employee/AddEmployee'
import Employee from './components/employee/Employee'
import UpdateEmployee from './components/employee/UpdateEmployee'
import Dashboard from './pages/Dashboard'
import Attendance from './components/attendance/Attendance'
import MarkAttendance from './components/attendance/MarkAttendance'
import Leave from './components/leave/Leave'
import AddLeave from './components/leave/AddLeave'
import Payroll from './components/payroll/Payroll'
import CreatePayroll from './components/payroll/CreatePayroll'
import ViewPayroll from './components/payroll/ViewPayroll'
import AdminDashboard from './pages/AdminDashboard'

function App() {

	useEffect(() => {
		document.title = "HR Management System";
	}, []);

	const { user } = useSelector((store) => store.auth);


	const appRouter = createBrowserRouter([

		// PUBLIC ROUTES		
		{
			path: "/",
			element: !user ? <Login /> : <Navigate to="/home" />,
		},
		{
			path: "/signup",
			element: <Signup />
		},

		// PROTECTED ROUTES
		{
			element: <MainLayout />,
			children: [
				{
					path: "/home",
					element: <Home />,
				},
				{
					path: "/dashboard",
					element: <Dashboard />,
				},
				{
					path: "/admin",
					element: <AdminDashboard />,
				},
				{
					path: "/profile",
					element: <Profile />,
				},
				{
					path: "/employees",
					element: <Employee />,
				},
				{
					path: "/employees/add-employee",
					element: <AddEmployee />,
				},
				{
					path: "/employees/update-employee/:id",
					element: <UpdateEmployee />,
				},
				{
					path: "/attendance",
					element: <Attendance />,
				},
				{
					path: "/attendance/mark-attendance",
					element: <MarkAttendance />,
				}, {
					path: "/leave",
					element: <Leave />,
				},
				{
					path: "/leave/request-leave",
					element: <AddLeave />,
				},
				{
					path: "/payroll",
					element: <Payroll />
				},				
				{
					path: "/payroll/generate-payroll",
					element: <CreatePayroll />
				},
				{
					path: "/payroll/view-payroll/:id",
					element: <ViewPayroll />
				}

			]
		}

	]);

	return (
		<div>
			<RouterProvider router={appRouter} />
		</div>
	)
}

export default App
