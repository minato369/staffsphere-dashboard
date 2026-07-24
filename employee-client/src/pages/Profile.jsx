import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { User, Mail, Shield, Phone, MapPin, CheckCircle2, Loader2, Save } from 'lucide-react';

const Profile = ({ user, onProfileUpdated }) => {
	const [formData, setFormData] = useState({
		phone: user?.phone || '',
		address: user?.address || ''
	});

	console.log(user);


	const [loading, setLoading] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (user) {
			setFormData({
				phone: user.phone || '',
				address: user.address || ''
			});
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setSuccessMsg('');
		setErrorMsg('');
		try {
			// Call the self-service update API
			const res = await employeeAPI.updateMyProfile(formData);
			const updatedUser = res.employee || res;

			onProfileUpdated(updatedUser);
			setSuccessMsg('Your personal contact information has been updated!');
		} catch (err) {
			setErrorMsg(err.message || 'Failed to update profile.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-950">My Profile</h1>
				<p className="text-sm text-slate-500 font-medium mt-0.5">
					View official access credentials and update personal contact details.
				</p>
			</div>

			{/* Notifications */}
			{successMsg && (
				<div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 border border-emerald-200">
					<CheckCircle2 className="w-4 h-4 shrink-0" />
					{successMsg}
				</div>
			)}

			{errorMsg && (
				<div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-200">
					{errorMsg}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* ID Badge Card */}
				<div className="md:col-span-1 rounded-2xl bg-white border border-slate-200/60 p-6 shadow-xs flex flex-col items-center text-center">
					<div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md mb-4">
						{user?.name?.charAt(0).toUpperCase() || 'U'}
					</div>

					<h2 className="text-lg font-bold text-slate-950">{user?.name}</h2>
					<p className="text-xs text-slate-500 font-medium mb-3">{user?.email}</p>

					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold mb-4">
						<Shield className="w-3.5 h-3.5" />
						{user?.role} Role
					</div>

					<div className="w-full pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs text-slate-600 font-medium">
						<div className="flex justify-between">
							<span className="text-slate-400">Employee ID:</span>
							<span className="font-mono font-bold text-slate-800">{user?.employeeId || `#${user?.id}`}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">System Status:</span>
							<span className="text-emerald-600 font-bold">Active</span>
						</div>
					</div>
				</div>

				{/* Edit Contact Information Card */}
				<div className="md:col-span-2 rounded-2xl bg-white border border-slate-200/60 p-6 shadow-xs">
					<h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
						Personal Information
					</h3>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Readonly Fields */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
									Full Name
								</label>
								<div className="relative">
									<User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
									<input
										type="text"
										disabled
										value={user?.name || ''}
										className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
									Corporate Email
								</label>
								<div className="relative">
									<Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
									<input
										type="text"
										disabled
										value={user?.email || ''}
										className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
									/>
								</div>
							</div>
						</div>

						{/* Editable Fields */}
						<div>
							<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
								Phone Number
							</label>
							<div className="relative">
								<Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
								<input
									type="text"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="+91 865412397"
									className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 font-medium"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
								Residential Address / Location
							</label>
							<div className="relative">
								<MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
								<input
									type="text"
									name="address"
									value={formData.address}
									onChange={handleChange}
									placeholder="City, Country"
									className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 font-medium"
								/>
							</div>
						</div>

						<div className="pt-4 border-t border-slate-100 flex justify-end">
							<button
								type="submit"
								disabled={loading}
								className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
							>
								{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
								Save Personal Profile
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Profile