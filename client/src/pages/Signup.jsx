import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLoading, setUser } from '../redux/authSlice';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";

const Signup = () => {

    useEffect(() => {
        document.title = "Signup Page"
    }, [])

    const { register, handleSubmit, watch } = useForm();
    const role = watch("role");

    const { loading } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (data) => {
        try {
            dispatch(setLoading(true));

            const res = await axios.post(
                `${import.meta.env.VITE_USER_ENDPOINT}/register`,
                data,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">

            {/* Glass Card */}
            <form
                onSubmit={handleSubmit(submitHandler)}
                className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    Create Account
                </h2>

                {/* Name */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Name"
                        {...register("name")}
                        className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 outline-none"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 outline-none"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 outline-none"
                    />
                </div>

                {/* Role Selection */}
                <div className="mb-6">
                    <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                        {["Admin", "HR", "Employee"].map((r) => (
                            <label
                                key={r}
                                className={`flex-1 text-center py-2 text-sm rounded-lg cursor-pointer transition-all
                                ${role === r
                                        ? "bg-white text-black shadow-md"
                                        : "text-white/70 hover:text-white"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    value={r}
                                    {...register("role")}
                                    className="hidden"
                                />
                                {r}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200"
                >
                    {loading ? "Please wait..." : "Signup"}
                </button>

                {/* Login */}
                <p className="text-center text-sm text-white mt-4">
                    Already have an account?
                    <Link to="/" className="underline ml-1 font-medium">
                        Login
                    </Link>
                </p>

            </form>
        </div>
    )
}

export default Signup;