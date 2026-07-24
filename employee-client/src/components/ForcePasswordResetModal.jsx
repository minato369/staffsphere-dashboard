import React, { useState } from 'react'
import { ShieldAlert } from 'lucide-react';
import { employeeAPI } from '../services/api';
const ForcePasswordResetModal = ({ isOpen, onPasswordChanged }) => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (newPassword.length < 6) {
			setError('New password must be at least 6 characters long.');
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('New passwords do not match.');
			return;
		}

		setLoading(true);

		try {
			const result = await employeeAPI.changePassword(currentPassword, newPassword);
			onPasswordChanged(result.user);
		} catch (err) {
			setError(err.message || 'Password update failed.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
				<div className="flex items-center gap-3 border-b border-slate-100 pb-4">
					<div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
						<ShieldAlert className="w-6 h-6" />
					</div>
					<div>
						<h3 className="text-lg font-bold text-slate-900">Security Requirement</h3>
						<p className="text-xs text-slate-500 font-medium">Password update required on initial login</p>
					</div>
				</div>

				{error && (
					<div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
							Current (Temporary) Password
						</label>
						<div className="relative">
							<input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								placeholder="••••••••"
								className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 font-medium"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
							New Permanent Password
						</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							placeholder="Min. 6 characters"
							className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 font-medium"
						/>
					</div>

					<div>
						<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
							Confirm New Password
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							placeholder="Re-enter new password"
							className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 font-medium"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
					>
						{loading ? 'Updating Credentials...' : 'Update Password & Access Dashboard'}
					</button>
				</form>
			</div>
		</div>
	);
}

export default ForcePasswordResetModal