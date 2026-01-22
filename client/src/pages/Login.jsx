import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { USER_ENDPOINT } from '../utils/constant';
import { setLoading, setUser } from '../redux/authSlice';
import { toast } from 'sonner';


const Login = () => {

    useEffect(() => {
        document.title = "Login Page"
    }, [])

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: ""
    });

    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const { name, value, type } = e.target;
        if (type === "radio") {
            setInput({ ...input, [name]: value, });
        } else {
            setInput({ ...input, [name]: value, });
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${import.meta.env.VITE_USER_ENDPOINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            })
            // console.log(res.data.success);
            // console.log("API response", res.data);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                console.log("navigating...")
                if (user?.role === "Employee") {
                    navigate('/home');
                } else {
                    navigate('/employees');
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            // console.log(error, 'error in login');
            // console.log(error.response?.data?.message || 'error response message');
            toast.error(error.response?.data?.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <form action="" onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                    <div className="my-2">
                        <input type="text" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="my-2">
                        <input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="my-2">
                        <div className="font-medium text-gray-700">Role:</div>
                        <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                                <input type="radio" name="role" value="Admin" checked={input.role === "Admin"} onChange={changeEventHandler} className="mr-2" />
                                <label htmlFor="Admin" className="text-gray-700">Admin</label>
                            </div>
                            <div className="flex items-center">
                                <input type="radio" name="role" value="HR" checked={input.role === "HR"} onChange={changeEventHandler} className="mr-2" />
                                <label htmlFor="HR" className="text-gray-700">HR</label>
                            </div>
                            <div className="flex items-center">
                                <input type="radio" name="role" value="Employee" checked={input.role === "Employee"} onChange={changeEventHandler} className="mr-2" />
                                <label htmlFor="Employee" className="text-gray-700">Employee</label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        {loading ? (
                            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Please wait...
                            </button>
                        ) : (
                            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Login
                            </button>
                        )}
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account yet?
                            <Link to='/signup' className="text-blue-500 hover:underline ps-1">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login