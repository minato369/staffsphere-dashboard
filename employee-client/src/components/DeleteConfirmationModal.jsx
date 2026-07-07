import React, { useState } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, employeeName }) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const handleConfirm = async () => {
		setError('');
		setIsDeleting(true);
		try {
			await onConfirm();
			onClose();
		} catch (err) {
			setError(err.message || 'Failed to complete operational deletion.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs font-sans p-4">
			<div className="absolute inset-0" onClick={onClose} />

			<div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 space-y-4">
				<div className="flex items-center gap-3">
					<div className="rounded-xl bg-red-50 p-2.5 text-red-600 shrink-0">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
					</div>
					<div>
						<h3 className="text-lg font-bold text-slate-950">Confirm Deletion</h3>
						<p className="text-xs text-slate-500 font-medium">This administrative action cannot be undone.</p>
					</div>
				</div>

				{error && (
					<div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
						{error}
					</div>
				)}

				<p className="text-sm text-slate-600 leading-relaxed">
					Are you absolutely sure you want to completely remove the corporate record profile for <span className="font-bold text-slate-900">{employeeName}</span> from the active StaffSphere directory pool stack?
				</p>

				<div className="flex items-center gap-3 border-t border-slate-100 pt-4 bg-white">
					<button
						type="button"
						onClick={onClose}
						disabled={isDeleting}
						className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						disabled={isDeleting}
						className="w-1/2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/10 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
					>
						{isDeleting ? 'Removing...' : 'Delete Profile'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteConfirmationModal