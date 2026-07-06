import React, { useState, useEffect } from 'react'
import { employeeAPI } from '../services/api';
import AddEmployeeModal from '../components/AddEmployeeModal';
import { useAuth } from '../context/AuthContext';

const Directory = () => {

	const { user } = useAuth()
	const [employees, setEmployees] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false); // Modal display toggle anchor state

	const fetchEmployees = async () => {
		try {
			const data = await employeeAPI.getAll();
			setEmployees(Array.isArray(data) ? data : data.employees || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	if (loading) return <div className="text-sm text-slate-500 font-medium p-8">Querying database matrix profiles...</div>;
	return (
		<div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
			{/* Top Interactive Banner Headers Row */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Employee Directory</h1>
					<p className="text-sm text-slate-500 font-medium mt-0.5">Manage system access tiers, operational logs, and profiles.</p>
				</div>

				{(user?.role === 'Admin' || user?.role === 'Manager') && (
					<button
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 cursor-pointer self-start sm:self-auto"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
						Add Employee
					</button>
				)}
			</div>	
			{error && (
				<div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">
					{error}
				</div>
			)}

			{/* Matrix Data Display Table Structure Box Container */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left text-sm text-slate-500">
						<thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/60">
							<tr>
								<th className="px-6 py-4">DB ID</th>
								<th className="px-6 py-4">Employee ID</th>
								<th className="px-6 py-4">Full Name</th>
								<th className="px-6 py-4">Email Address</th>
								<th className="px-6 py-4">Access Role</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 font-normal text-slate-950">
							{employees.map((emp) => (
								<tr key={emp.id} className="hover:bg-slate-50/50 transition">
									<td className="px-6 py-4 font-mono text-xs text-slate-400 font-bold">#{emp.id}</td>
									<td className="px-6 py-4 font-medium text-slate-600">{emp.employeeId}</td>
									<td className="px-6 py-4 font-bold text-slate-950">{emp.name}</td>
									<td className="px-6 py-4 text-slate-600">{emp.email}</td>
									<td className="px-6 py-4">
										<span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${emp.role === 'Admin'
												? 'bg-purple-50 text-purple-700 border-purple-100'
												: 'bg-indigo-50 text-indigo-700 border-indigo-100'
											}`}>
											{emp.role}
										</span>
									</td>
								</tr>
							))}
							{employees.length === 0 && (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
										No active employee profiles found inside this directory pool stack.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Injected Slide-over Modal Form */}
			<AddEmployeeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onRefresh={fetchEmployees}
			/>
		</div>
	)
}

export default Directory