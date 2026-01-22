import React, { useState, useRef, useEffect } from 'react'
import userAvatar from '../../public/userAvatar.png'
import LOGO from '../../public/mainLogo.png'
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
        <div className="navbar bg-white shadow-sm z-50 fixed top-0 left-0 w-full print:hidden flex items-center px-5">

            {/* Sidebar Toggle Button */}
            <button onClick={toggleSidebar} className="p-2 mr-4 rounded-md bg-gray-100 md:hidden">
                <Menu size={24} />
            </button>

            {/* IMT Logo */}
            {/* <div className="flex-1">
                <Link to="/" className="text-xl font-semibold text-slate-900 hover:text-gray-500">
                    HMS
                </Link>
            </div> */}
            
            <div className="flex items-center m-0 p-0 leading-none">
                <Link to="/">
                    <img className="block m-0 p-0 max-h-10 max-w-45 object-contain" src={LOGO} alt="Logo" />
                </Link>
            </div>

            {/* User/Login Section */}
            <div className="flex-none mr-5 ">
                {!user && (
                    <ul className="flex gap-4 items-center">
                        <li>
                            <Link to="/login" className="text-slate-900 hover:text-gray-500">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" className="text-slate-900 hover:text-gray-500">
                                Signup
                            </Link>
                        </li>
                    </ul>
                )}
            </div>

            {user && (
                <div className="flex gap-2 mr-8 items-center ms-auto">
                    {/* Avatar and Dropdown */}
                    <div className="relative">
                        <button ref={avatarButtonRef} onClick={toggleDropdown} className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center focus:outline-none cursor-pointer">
                            <img src={userAvatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                        </button>

                        {isDropdownOpen && (
                            <div ref={dropdownRef} className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <ul className="py-2">
                                    {/* <li>
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                            Profile
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                            Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
