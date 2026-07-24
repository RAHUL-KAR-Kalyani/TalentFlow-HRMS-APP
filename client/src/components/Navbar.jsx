import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_ENDPOINT } from '../utils/constant'
import { setUser } from '../redux/authSlice'
import { toast } from 'sonner'
import { Menu } from 'lucide-react'

const Navbar = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dropdownRef = useRef(null);
    const avatarButtonRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                avatarButtonRef.current &&
                !avatarButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_USER_ENDPOINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white border-b border-gray-200/50">

            <div className="flex items-center justify-between px-6 h-16">

                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Sidebar Toggle */}
                    <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition md:hidden">
                        <Menu size={22} />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img className="h-9 object-contain" src="/mainLogo.png" alt="Logo" />
                    </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* If NOT logged in */}
                    {!user && (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-black transition">
                                Login
                            </Link>

                            <Link to="/signup" className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition shadow-sm">
                                Sign up
                            </Link>
                        </>
                    )}

                    {/* If logged in */}
                    {user && (
                        <div className="relative">

                            {/* Avatar */}
                            <button ref={avatarButtonRef} onClick={toggleDropdown} className="w-10 h-10 rounded-full overflow-hidden  border border-gray-300 hover:ring-2 hover:ring-indigo-400  transition">
                                <img src="/userAvatar.png" alt="User" className="w-full h-full object-cover" />
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div ref={dropdownRef} className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                                    <div className="px-4 py-3 border-b text-sm text-gray-600">
                                        Signed in as <br />
                                        <span className="font-medium text-gray-900">
                                            {user?.email}
                                        </span>
                                    </div>

                                    <ul className="py-2 text-sm">
                                        <li>
                                            <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 transition">
                                                Settings
                                            </Link>
                                        </li>

                                        <li>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;