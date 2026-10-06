import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ForcePasswordResetModal from '../components/ForcePasswordResetModal';
import { useAuth } from '../context/AuthContext';
import { Trash2, Pencil, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Building2 } from 'lucide-react';
import exportToCsv from '../utils/exportCsv.js';

const DEPARTMENTS = [
	'All',
	'Engineering',
	'Product',
	'Design',
	'Marketing',
	'Sales',
	'HR',
	'Operations'
];

const Directory = () => {
	const { user, updateUser } = useAuth();
	const [employees, setEmployees] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// States for operational deletion anchors
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);

	// Filter states
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('All');
	const [departmentFilter, setDepartmentFilter] = useState('All');

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Edit modal states
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedEditEmployee, setSelectedEditEmployee] = useState(null);

	const totalStaff = employees.length;
	const totalAdmins = employees.filter(emp => emp.role === 'Admin').length;
	const totalManagers = employees.filter(emp => emp.role === 'Manager').length;
	const totalEmployees = employees.filter(emp => emp.role === 'Employee').length;

	// Reset pagination to first page when search criteria change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handleRoleChange = (e) => {
		setRoleFilter(e.target.value);
		setCurrentPage(1);
	};

	const handleDepartmentChange = (e) => {
		setDepartmentFilter(e.target.value);
		setCurrentPage(1);
	};

	// Filtered Dataset across search term, role, and department
	const filteredEmployees = employees.filter((emp) => {
		const query = searchTerm.toLowerCase();
		const matchesSearch =
			emp.name?.toLowerCase().includes(query) ||
			emp.email?.toLowerCase().includes(query) ||
			emp.employeeId?.toLowerCase().includes(query) ||
			emp.department?.toLowerCase().includes(query);

		const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
		const matchesDept = departmentFilter === 'All' || (emp.department || 'Engineering') === departmentFilter;

		return matchesSearch && matchesRole && matchesDept;
	});

	// Pagination range calculations
	const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage) || 1;
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);

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

	const handleDeleteExecute = async () => {
		if (!selectedEmployee) return;
		await employeeAPI.delete(selectedEmployee.id);
		fetchEmployees();
	};

	const triggerDeletePrompt = (employee) => {
		setSelectedEmployee(employee);
		setIsDeleteModalOpen(true);
	};

	const triggerEditPrompt = (employee) => {
		setSelectedEditEmployee(employee);
		setIsEditModalOpen(true);
	};

	const handleUpdateExecute = async (id, updatedFields) => {
		const response = await employeeAPI.updateEmployee(id, updatedFields);
		const updatedRecord = response.employee || response;

		setEmployees(prev =>
			prev.map(emp => (emp.id === id ? { ...emp, ...updatedRecord } : emp))
		);
	};

	const handlePasswordResetComplete = (updatedUser) => {
		updateUser(updatedUser);
	};

	const handleExport = () => {
		const recordsToExport = filteredEmployees.length > 0 ? filteredEmployees : employees;
		exportToCsv(recordsToExport, `staffsphere_directory_${new Date().toISOString().slice(0, 10)}.csv`);
	};

	const getDepartmentBadgeStyle = (dept = 'Engineering') => {
		switch (dept) {
			case 'Engineering':
				return 'bg-blue-50 text-blue-700 border-blue-200/80';
			case 'Product':
				return 'bg-violet-50 text-violet-700 border-violet-200/80';
			case 'Design':
				return 'bg-pink-50 text-pink-700 border-pink-200/80';
			case 'Marketing':
				return 'bg-orange-50 text-orange-700 border-orange-200/80';
			case 'Sales':
				return 'bg-amber-50 text-amber-700 border-amber-200/80';
			case 'HR':
				return 'bg-teal-50 text-teal-700 border-teal-200/80';
			case 'Operations':
				return 'bg-slate-100 text-slate-700 border-slate-200';
			default:
				return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	if (loading) return <div className="text-sm text-slate-500 font-medium p-8">Querying database matrix profiles...</div>;

	const hasActiveFilters = searchTerm !== '' || roleFilter !== 'All' || departmentFilter !== 'All';

	return (
		<div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
			{/* Top Interactive Banner Headers Row */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Employee Directory</h1>
					<p className="text-sm text-slate-500 font-medium mt-0.5">Manage system access tiers, operational logs, and profiles.</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						disabled={employees.length === 0}
						className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
						title="Export directory records to CSV"
					>
						<Download className="w-4 h-4 text-slate-500" />
						Export CSV
					</button>

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
			</div>

			{/* Dynamic Metric Stats Grid Cards Row */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

			{/* Interactive Search, Role, and Department Filter Toolbar */}
			<div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
				{/* Search input */}
				<div className="relative flex-1">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
					</div>
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search workspace profiles by name, email, ID, or department..."
						className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 placeholder-slate-400 font-medium"
					/>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3">
					{/* Role Filter */}
					<div className="w-full sm:w-44">
						<select
							value={roleFilter}
							onChange={handleRoleChange}
							className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs cursor-pointer"
						>
							<option value="All">All Roles</option>
							<option value="Admin">Admin</option>
							<option value="Manager">Manager</option>
							<option value="Employee">Employee</option>
						</select>
					</div>

					{/* Department Filter */}
					<div className="w-full sm:w-48">
						<select
							value={departmentFilter}
							onChange={handleDepartmentChange}
							className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs cursor-pointer"
						>
							{DEPARTMENTS.map((dept) => (
								<option key={dept} value={dept}>
									{dept === 'All' ? 'All Departments' : dept}
								</option>
							))}
						</select>
					</div>

					{/* Reset Button */}
					{hasActiveFilters && (
						<button
							onClick={() => {
								setSearchTerm('');
								setRoleFilter('All');
								setDepartmentFilter('All');
								setCurrentPage(1);
							}}
							className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition px-2 py-1 cursor-pointer shrink-0"
						>
							Reset
						</button>
					)}
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
								<th className="px-6 py-4">Department</th>
								<th className="px-6 py-4">Access Role</th>
								{(user?.role === 'Admin' || user?.role === 'Manager') && (
									<th className="px-6 py-4 text-right">Actions</th>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 font-normal text-slate-950">
							{currentRows.map((emp) => (
								<tr key={emp.id} className="hover:bg-slate-50/50 transition">
									<td className="px-6 py-4 font-mono text-xs text-slate-400 font-bold">#{emp.id}</td>
									<td className="px-6 py-4 font-medium text-slate-600">{emp.employeeId}</td>
									<td className="px-6 py-4 font-bold text-slate-950">{emp.name}</td>
									<td className="px-6 py-4 text-slate-600">{emp.email}</td>
									{/* Department Badge */}
									<td className="px-6 py-4">
										<span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border ${getDepartmentBadgeStyle(emp.department)}`}>
											<Building2 className="w-3 h-3 opacity-70" />
											{emp.department || 'Engineering'}
										</span>
									</td>
									{/* Role Badge */}
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
									{(user?.role === 'Admin' || user?.role === 'Manager') && (
										<td className="px-6 py-4 text-right">
											{user.role === 'Manager' && emp.role === 'Admin' ? (
												<span className="text-xs font-medium text-slate-400 italic">Locked</span>
											) : (
												<div className="flex items-center justify-end gap-1">
													<button
														onClick={() => triggerEditPrompt(emp)}
														className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 cursor-pointer"
														title="Edit Profile"
													>
														<Pencil className="w-4 h-4" strokeWidth={2.2} />
													</button>

													{user.id === emp.id ? (
														<span className="text-xs font-medium text-slate-400 italic px-2">You</span>
													) : (
														<button
															onClick={() => triggerDeletePrompt(emp)}
															className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition duration-150 cursor-pointer"
															title="Delete Profile"
														>
															<Trash2 className="w-4 h-4" strokeWidth={2.2} />
														</button>
													)}
												</div>
											)}
										</td>
									)}
								</tr>
							))}

							{filteredEmployees.length === 0 && (
								<tr>
									<td colSpan={(user?.role === 'Admin' || user?.role === 'Manager') ? "7" : "6"} className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
										No active employee profiles found matching your search parameters.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Dynamic Pagination Controls */}
				{filteredEmployees.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200/60 bg-slate-50/60">
						<div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
							<span>
								Showing <strong className="text-slate-800">{indexOfFirstRow + 1}</strong> to <strong className="text-slate-800">{Math.min(indexOfLastRow, filteredEmployees.length)}</strong> of <strong className="text-slate-800">{filteredEmployees.length}</strong> records
							</span>

							<div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
								<span>Rows:</span>
								<select
									value={rowsPerPage}
									onChange={(e) => {
										setRowsPerPage(Number(e.target.value));
										setCurrentPage(1);
									}}
									className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-2xs focus:border-indigo-600 focus:outline-none cursor-pointer"
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
								</select>
							</div>
						</div>

						<div className="flex items-center gap-1">
							<button
								onClick={() => setCurrentPage(1)}
								disabled={currentPage === 1}
								className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
								title="First Page"
							>
								<ChevronsLeft className="w-4 h-4" />
							</button>

							<button
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
								className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
								title="Previous Page"
							>
								<ChevronLeft className="w-4 h-4" />
							</button>

							<span className="px-3 text-xs font-bold text-slate-700">
								Page {currentPage} of {totalPages}
							</span>

							<button
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
								disabled={currentPage === totalPages}
								className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
								title="Next Page"
							>
								<ChevronRight className="w-4 h-4" />
							</button>

							<button
								onClick={() => setCurrentPage(totalPages)}
								disabled={currentPage === totalPages}
								className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
								title="Last Page"
							>
								<ChevronsRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Injected Slide-over Creation Modal */}
			<AddEmployeeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onRefresh={fetchEmployees}
			/>

			<EditEmployeeModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedEditEmployee(null);
				}}
				employee={selectedEditEmployee}
				onUpdateSuccess={handleUpdateExecute}
				currentUserRole={user?.role}
			/>

			{/* Structural Deletion Confirmation Modal */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedEmployee(null);
				}}
				onConfirm={handleDeleteExecute}
				employeeName={selectedEmployee?.name || ''}
			/>

			<ForcePasswordResetModal
				isOpen={user?.isInitialPassword === true}
				onPasswordChanged={handlePasswordResetComplete}
			/>
		</div>
	);
};

export default Directory;