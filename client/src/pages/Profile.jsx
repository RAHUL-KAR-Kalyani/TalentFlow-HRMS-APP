import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IdCard, Mail } from 'lucide-react';

const Profile = () => {
    useEffect(() => {
        document.title = "Profile";
    }, []);

    const { user } = useSelector(store => store.auth);
    const { employees } = useSelector(store => store.employee);

    // const filteredEmployee = employees?.find(employee => employee.name === user?.name);
    const filteredEmployee = employees?.find(emp => emp.name === user?.name);

    // console.log("Filtered Employee:", filteredEmployee);
    // console.log("Matched Employee:", matchedEmployee);


    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 profle-z-index">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                {/* Header Background Gradient */}
                <div className="h-32 bg-linear-to-r from-indigo-600 to-purple-600 relative">
                    <div className="absolute top-4 right-4"></div>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                                <span className="text-3xl font-bold text-gray-500">
                                    {getInitials(user?.name)}
                                </span>
                            </div>
                            <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>

                    </div>

                    {/* User Name & Role */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{user?.name || "Guest User"}</h1>
                            {user?.role && (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${user.role === 'admin' || filteredEmployee?.designation === 'ceo'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {user.role === 'admin' || filteredEmployee?.designation === 'ceo' ? `${user.role} & ${filteredEmployee?.designation}` : `${filteredEmployee?.designation || user.role}`}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">Member since 2024</p>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Email Card */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</p>
                                <p className="text-gray-900 font-medium break-all">{user?.email || "N/A"}</p>
                            </div>
                        </div>

                        {/* ID Card */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                <IdCard className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</p>
                                <p className="text-gray-900 font-medium font-mono text-sm">{user?._id || "#######"}</p>
                            </div>
                        </div>

                    </div>
                </div>



            </div>
        </div>
    );
};

export default Profile;