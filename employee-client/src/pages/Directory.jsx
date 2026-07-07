import React, { useState, useEffect } from 'react'
import { employeeAPI } from '../services/api';
import AddEmployeeModal from '../components/AddEmployeeModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Directory = () => {
	const { user } = useAuth()
	const [employees, setEmployees] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 🛠️ States for operational deletion anchors
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);

	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('All');

	const totalStaff = employees.length;
	const totalAdmins = employees.filter(emp => emp.role === 'Admin').length;
	const totalManagers = employees.filter(emp => emp.role === 'Manager').length;
	const totalEmployees = employees.filter(emp => emp.role === 'Employee').length;

	const filteredEmployees = employees.filter((emp) => {
		const matchesSearch =
			emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesRole = roleFilter === 'All' || emp.role === roleFilter;

		return matchesSearch && matchesRole;
	});

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

	// 🛠️ Execute API removal command on concrete confirmation
	const handleDeleteExecute = async () => {
		if (!selectedEmployee) return;
		await employeeAPI.delete(selectedEmployee.id);
		fetchEmployees(); // Refresh data grid list natively on successful execution
	};

	const triggerDeletePrompt = (employee) => {
		setSelectedEmployee(employee);
		setIsDeleteModalOpen(true);
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

			{/* Dynamic Metric Stats Grid Cards Row */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Total Strength Card */}
				<div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-200/80">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Strength</span>
						<div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
						</div>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950 tracking-tight">{totalStaff}</span>
						<span className="text-xs font-semibold text-slate-500">Active Records</span>
					</div>
				</div>

				{/* Executive Core Card */}
				<div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-200/80">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Executive Core</span>
						<div className="rounded-xl bg-purple-50 p-2 text-purple-600">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" /></svg>
						</div>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950 tracking-tight">{totalAdmins}</span>
						<span className="text-xs font-semibold text-slate-500">System Admins</span>
					</div>
				</div>

				{/* Management Card */}
				<div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-200/80">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Management</span>
						<div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-3 3H15m-3 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
						</div>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950 tracking-tight">{totalManagers}</span>
						<span className="text-xs font-semibold text-slate-500">Active Managers</span>
					</div>
				</div>

				{/* Operations Card */}
				<div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-200/80">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operations Staff</span>
						<div className="rounded-xl bg-amber-50 p-2 text-amber-600">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
						</div>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950 tracking-tight">{totalEmployees}</span>
						<span className="text-xs font-semibold text-slate-500">Standard Employees</span>
					</div>
				</div>
			</div>

			{error && (
				<div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">
					{error}
				</div>
			)}

			{/* Interactive Search and Filter Toolbar Row */}
			<div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
				<div className="relative w-full sm:flex-1">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
					</div>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search workspace profiles by name, email, or employee ID..."
						className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 placeholder-slate-400 font-medium"
					/>
				</div>

				<div className="w-full sm:w-48">
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-semibold transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs cursor-pointer"
					>
						<option value="All">All Status Roles</option>
						<option value="Admin">System Admin</option>
						<option value="Manager">Active Manager</option>
						<option value="Employee">Standard Employee</option>
					</select>
				</div>
			</div>

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
								{/* 🛠️ Dynamically show "Actions" column only if user has privilege */}
								{(user?.role === 'Admin' || user?.role === 'Manager') && (
									<th className="px-6 py-4 text-right">Actions</th>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 font-normal text-slate-950">
							{filteredEmployees.map((emp) => (
								<tr key={emp.id} className="hover:bg-slate-50/50 transition">
									<td className="px-6 py-4 font-mono text-xs text-slate-400 font-bold">#{emp.id}</td>
									<td className="px-6 py-4 font-medium text-slate-600">{emp.employeeId}</td>
									<td className="px-6 py-4 font-bold text-slate-950">{emp.name}</td>
									<td className="px-6 py-4 text-slate-600">{emp.email}</td>
									<td className="px-6 py-4">
										<span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${emp.role === 'Admin'
											? 'bg-purple-50 text-purple-700 border-purple-100'
											: emp.role === 'Manager'
												? 'bg-emerald-50 text-emerald-700 border-emerald-100'
												: 'bg-indigo-50 text-indigo-700 border-indigo-100'
											}`}>
											{emp.role}
										</span>
									</td>
									{/* 🛠️ Render action controls button if allowed */}
									{(user?.role === 'Admin' || user?.role === 'Manager') && (
										<td className="px-6 py-4 text-right">
											{/* Prevent managers from erasing Admins or themselves */}
											{user.role === 'Manager' && emp.role === 'Admin' ? (
												<span className="text-xs font-medium text-slate-400 italic">Locked</span>
											) : user.id === emp.id ? (
												<span className="text-xs font-medium text-slate-400 italic">You</span>
											) : (
												<button
													onClick={() => triggerDeletePrompt(emp)}
													className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition duration-150 cursor-pointer"
													title="Delete Profile"
												>
													{/* 🛠️ Lucide Icon: Automatically bounded, centered, and crisp */}
													<Trash2 className="w-4 h-4" strokeWidth={2.2} />
												</button>
											)}
										</td>
									)}
								</tr>
							))}

							{filteredEmployees.length === 0 && (
								<tr>
									<td colSpan={(user?.role === 'Admin' || user?.role === 'Manager') ? "6" : "5"} className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
										No active employee profiles found matching your search parameters.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Injected Slide-over Creation Modal */}
			<AddEmployeeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onRefresh={fetchEmployees}
			/>

			{/* 🛠️ Injected Structural Deletion Protection Guard Modal */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedEmployee(null);
				}}
				onConfirm={handleDeleteExecute}
				employeeName={selectedEmployee?.name || ''}
			/>
		</div>
	)
}

export default Directory;