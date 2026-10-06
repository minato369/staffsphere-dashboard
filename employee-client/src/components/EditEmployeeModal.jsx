import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const DEPARTMENTS = [
	'Engineering',
	'Product',
	'Design',
	'Marketing',
	'Sales',
	'HR',
	'Operations'
];

const EditEmployeeModal = ({ isOpen, onClose, employee, onUpdateSuccess, currentUserRole }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		role: 'Employee',
		department: 'Engineering',
		phone: '',
		address: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const isAdmin = currentUserRole === 'Admin';

	useEffect(() => {
		if (employee) {
			setFormData({
				name: employee.name || '',
				email: employee.email || '',
				role: employee.role || 'Employee',
				department: employee.department || 'Engineering',
				phone: employee.phone || '',
				address: employee.address || ''
			});
			setError('');
		}
	}, [employee]);

	if (!isOpen || !employee) return null;

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await onUpdateSuccess(employee.id, formData);
			onClose();
		} catch (err) {
			setError(err.message || 'Failed to update profile.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
			<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all">
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<div>
						<h3 className="text-lg font-semibold text-slate-800">Edit Employee Profile</h3>
						<p className="text-xs text-slate-400">ID: {employee.employeeId || employee.id}</p>
					</div>
					<button
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{error && (
					<div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-600 mb-1">
							Email Address {!isAdmin && <span className="text-amber-600">(Admin only)</span>}
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							disabled={!isAdmin}
							required
							className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${!isAdmin
								? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
								: 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
								}`}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-medium text-slate-600 mb-1">
								Access Role {!isAdmin && <span className="text-amber-600">(Admin only)</span>}
							</label>
							<select
								name="role"
								value={formData.role}
								onChange={handleChange}
								disabled={!isAdmin}
								className={`w-full rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer ${!isAdmin
									? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
									: 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
									}`}
							>
								<option value="Employee">Employee</option>
								<option value="Manager">Manager</option>
								<option value="Admin">Admin</option>
							</select>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 mb-1">
								Department
							</label>
							<select
								name="department"
								value={formData.department}
								onChange={handleChange}
								className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
							>
								{DEPARTMENTS.map((dept) => (
									<option key={dept} value={dept}>
										{dept}
									</option>
								))}
							</select>
						</div>
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
						<input
							type="text"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
						<textarea
							name="address"
							rows="2"
							value={formData.address}
							onChange={handleChange}
							className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					{/* Form Footer Buttons */}
					<div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditEmployeeModal;