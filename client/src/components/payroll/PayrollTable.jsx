import React, { useEffect, useState } from 'react'
import useGetAllPayroll from '../../hooks/useGetAllPayroll'
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PayrollTable = () => {
	useGetAllPayroll();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);
	const { payroll, searchPayrollByName } = useSelector(store => store.payroll)
	// console.log(payroll, 'payroll in payroll table component');
	const [filterPayroll, setfilterPayroll] = useState(payroll);
	const isEmployee = user?.role === 'Employee';
	// const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	const getMonthName = (month) => {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		return months[month - 1];
	};

	useEffect(() => {
		if (!Array.isArray(payroll)) {
			setfilterPayroll([]);
			return;
		}
		// if (!payroll) return;
		const filteredPayroll = payroll.filter((payrollItem) => {
			if (!searchPayrollByName) {
				return true;
			}
			return payrollItem.employee?.name?.toLowerCase().includes(searchPayrollByName.toLowerCase());
		});
		setfilterPayroll(filteredPayroll);
		// console.log(filteredPayroll, 'filteredPayroll in filter');
	}, [payroll, searchPayrollByName]);

	const ViewPayrollHandler = (id) => {
		// dispatch action to view payroll details
		navigate(`/payroll/view-payroll/${id}`)
	}


	return (
		<div className='overflow-x-auto min-w-60'>
			<table className="table">
				<thead>
					<tr>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Id</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Employee Name</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Month</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Year</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gross Salary</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>allowances</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Deductions</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Net Salary</th>
						<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Manage</th>
					</tr>
				</thead>
				<tbody>
					{filterPayroll && filterPayroll.length > 0 ? (
						filterPayroll.map((payrollItem) => (
							<tr key={payrollItem.id} className="hover:bg-gray-100">
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.employee?._id}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.employee?.name}</td>
								{/* <td className='px-4 py-2 text-sm text-gray-700'>{months[payrollItem?.month - 1]}</td> */}
								<td className='px-4 py-2 text-sm text-gray-700'>{getMonthName(payrollItem?.month)}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.year}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.baseSalary}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.allowances}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.deductions}</td>
								<td className='px-4 py-2 text-sm text-gray-700'>{payrollItem?.netSalary}</td>
								<td className='px-4 py-2 capitalize whitespace-nowrap text-sm text-gray-700 flex gap-6'>
									<div className='relative'>
										<Eye size={20} className='hover:cursor-pointer' onClick={() => ViewPayrollHandler(payrollItem?._id)} />
									</div>
									{/* <div className='relative'>
										<Pen size={20} className='hover:cursor-pointer' />
									</div> */}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="3" className='px-4 py-2 text-sm text-gray-700 text-center'>No payroll data available</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default PayrollTable
