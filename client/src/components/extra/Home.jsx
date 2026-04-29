import React from 'react'
import Dashboard from '../../pages/Dashboard';
import { useSelector } from 'react-redux';
import AdminDashboard from '../../pages/AdminDashboard';

const Home = () => {
    const { employees } = useSelector(store => store.employee);
    const { user } = useSelector((store) => store.auth);
    
    const role = user?.role?.toLowerCase();
    return (
        <div>
            {role === 'employee' ? <Dashboard /> : <AdminDashboard />}
        </div>
    )
}

export default Home
