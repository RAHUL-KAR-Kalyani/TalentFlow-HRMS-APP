import React, { useEffect, useState } from 'react'
import useGetAllPayroll from '../../hooks/useGetAllPayroll'
import useGetAllEmployees from '../../hooks/useGetAllEmployees';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BriefcaseBusiness, HandCoins } from "lucide-react";

const ViewPayroll = () => {
    useEffect(() => {
        document.title = "View Payroll";
    }, []);
    useGetAllPayroll();
    useGetAllEmployees();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useSelector((store) => store.auth);
    const { payroll } = useSelector(store => store.payroll);
    const { employees } = useSelector(store => store.employee);
    const [selectedPayroll, setSelectedPayroll] = useState(null);

    const getMonthName = (month) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
    };
    //{getMonthName(payrollItem?.month)}

    useEffect(() => {
        const foundPayroll = payroll.find(p => p._id === id);
        // console.log('payroll id in payroll', foundPayroll);
        if (foundPayroll) {
            // navigate('/payroll');
            // console.log('selected employee id in payroll', foundPayroll?.employee?._id,);
            toast.success('Payroll found');
        }
        setSelectedPayroll(foundPayroll);

    }, [id, payroll]);
    // console.log('selectedPayroll in view payroll', selectedPayroll);
    const designationFont = selectedPayroll?.employee?.designation === 'ceo' ? 'uppercase' : 'capitalize';

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 print:shadow-none print:border-none print:min-h-0">
            <div className="w-full max-w-3xl bg-white border border-blue-300 rounded-lg shadow-md p-6 md:p-8">

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {/* <BriefcaseBusiness size={30} className='text-blue-700' /> */}
                        <HandCoins size={35} className='text-blue-500 rotate-45' />
                        <h1 className="text-xl md:text-2xl font-bold text-blue-500">
                            PAYROLL STATEMENT
                        </h1>
                    </div>
                </div>

                <div className="border-t border-b py-4 mb-6">
                    {/* <h2 className="text-blue-600 font-semibold mb-3">
                        Employee Details
                    </h2> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <p><strong>Employee ID:</strong> {selectedPayroll?.employee?._id}</p>
                        <p><strong>Employee Name:</strong> {selectedPayroll?.employee?.name}</p>
                        <p className='capitalize'><strong>Department:</strong> {selectedPayroll?.employee?.department}</p>
                        <p className={`${designationFont}`}><strong className='capitalize'>Designation:</strong> {selectedPayroll?.employee?.designation}</p>
                        <p><strong>Employment Type:</strong> {selectedPayroll?.employee?.employment_type}</p>
                        <p><strong>Period:</strong> {getMonthName(selectedPayroll?.month)} {selectedPayroll?.year}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                    <div className="border rounded">
                        <h3 className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-center py-2 font-semibold">
                            Earnings
                        </h3>
                        <div className="p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Basic Salary</span>
                                <span>{selectedPayroll?.baseSalary}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Allowances</span>
                                <span>{selectedPayroll?.allowances}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded">
                        <h3 className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-center py-2 font-semibold">
                            Deductions
                        </h3>
                        <div className="p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Absent Days</span>
                                <span>{selectedPayroll?.absentDays}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Total Deductions</span>
                                <span>{selectedPayroll?.deductions}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 mb-6 text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Total Working Days</span>
                        <span>{selectedPayroll?.totalDays}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Present Days</span>
                        <span>{selectedPayroll?.totalPresentDays}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Leave & Absent Days</span>
                        <span>{selectedPayroll?.absentDays}</span>
                    </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Gross Salary</span>
                        <span>{selectedPayroll?.baseSalary}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-blue-700">
                        <span>Net Salary</span>
                        <span>{selectedPayroll?.netSalary}</span>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Payroll Generated Successfully
                </p>

                <button onClick={() => window.print()} className="bg-gray-600 text-white px-4 py-2 rounded print:hidden flex mx-auto mt-6 hover:bg-gray-700 hover:cursor-pointer">
                    Print
                </button>
            </div>
        </div>
    )
}

export default ViewPayroll
