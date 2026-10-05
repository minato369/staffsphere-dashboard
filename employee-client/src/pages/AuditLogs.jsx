import React, { useState, useEffect } from 'react'
import { auditAPI } from '../services/api';
import { Activity, UserPlus, UserCheck, Trash2, RefreshCw, Shield, Clock, Filter, FileText } from 'lucide-react';
const AuditLogs = () => {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [actionFilter, setActionFilter] = useState('ALL');

	const fetchLogs = async () => {
		setLoading(true);
		setError('');
		try {
			const data = await auditAPI.getLogs();
			setLogs(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || 'Failed to load system audit logs.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const filteredLogs = logs.filter(log => {
		if (actionFilter === 'ALL') return true;
		return log.action === actionFilter;
	});

	const getActionBadge = (action) => {
		switch (action) {
			case 'CREATE_EMPLOYEE':
				return {
					label: 'Created Profile',
					color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
					icon: <UserPlus className="w-3.5 h-3.5" />
				};
			case 'UPDATE_EMPLOYEE':
				return {
					label: 'Updated Employee',
					color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
					icon: <RefreshCw className="w-3.5 h-3.5" />
				};
			case 'DELETE_EMPLOYEE':
				return {
					label: 'Purged Record',
					color: 'bg-red-50 text-red-700 border-red-200',
					icon: <Trash2 className="w-3.5 h-3.5" />
				};
			case 'PROFILE_UPDATE':
				return {
					label: 'Self Profile Update',
					color: 'bg-amber-50 text-amber-700 border-amber-200',
					icon: <UserCheck className="w-3.5 h-3.5" />
				};
			default:
				return {
					label: action,
					color: 'bg-slate-100 text-slate-700 border-slate-200',
					icon: <Activity className="w-3.5 h-3.5" />
				};
		}
	};

	return (
		<div className="space-y-6 max-w-7xl mx-auto">
			{/* Header with Quick Refresh */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-950 flex items-center gap-2.5">
						<Activity className="w-7 h-7 text-indigo-600" />
						System Audit Logs
					</h1>
					<p className="text-sm text-slate-500 font-medium mt-0.5">
						Immutable event ledger recording operational mutations, access changes, and user updates.
					</p>
				</div>

				<button
					onClick={fetchLogs}
					disabled={loading}
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
				>
					<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
					Refresh Feed
				</button>
			</div>

			{/* Filter Toolbar */}
			<div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
				<div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
					<Filter className="w-4 h-4 text-slate-400" />
					Filter by Action:
				</div>
				<div className="w-full sm:w-64">
					<select
						value={actionFilter}
						onChange={(e) => setActionFilter(e.target.value)}
						className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 cursor-pointer"
					>
						<option value="ALL">All Logged Actions</option>
						<option value="CREATE_EMPLOYEE">Profile Creation (CREATE)</option>
						<option value="UPDATE_EMPLOYEE">Admin Updates (UPDATE)</option>
						<option value="DELETE_EMPLOYEE">Purged Records (DELETE)</option>
						<option value="PROFILE_UPDATE">Self-Service Edits (PROFILE)</option>
					</select>
				</div>
			</div>

			{error && (
				<div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">
					{error}
				</div>
			)}

			{/* Event Timeline Table */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left text-sm text-slate-500">
						<thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/60">
							<tr>
								<th className="px-6 py-4">Event / Action</th>
								<th className="px-6 py-4">Operator (Performer)</th>
								<th className="px-6 py-4">Target Entity</th>
								<th className="px-6 py-4">Details Summary</th>
								<th className="px-6 py-4 text-right">Timestamp</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 font-normal text-slate-950">
							{filteredLogs.map((log) => {
								const badge = getActionBadge(log.action);
								return (
									<tr key={log.id} className="hover:bg-slate-50/50 transition">
										{/* Action Badge */}
										<td className="px-6 py-4">
											<span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border ${badge.color}`}>
												{badge.icon}
												{badge.label}
											</span>
										</td>

										{/* Performer Info */}
										<td className="px-6 py-4">
											<div className="font-bold text-slate-900">{log.performerName}</div>
											<div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
												<Shield className="w-3 h-3 text-indigo-500" />
												{log.performerRole} (ID #{log.performerId})
											</div>
										</td>

										{/* Target Info */}
										<td className="px-6 py-4">
											{log.targetName ? (
												<div>
													<span className="font-semibold text-slate-800">{log.targetName}</span>
													{log.targetId && (
														<span className="ml-1 text-xs font-mono text-slate-400">#{log.targetId}</span>
													)}
												</div>
											) : (
												<span className="text-xs text-slate-400 italic">System / Self</span>
											)}
										</td>

										{/* Operational Details */}
										<td className="px-6 py-4">
											<div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
												<FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
												<span className="truncate max-w-xs">{log.details || 'No extended metadata'}</span>
											</div>
										</td>

										{/* Timestamp */}
										<td className="px-6 py-4 text-right">
											<div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
												<Clock className="w-3.5 h-3.5 text-slate-400" />
												{new Date(log.createdAt).toLocaleString(undefined, {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													second: '2-digit'
												})}
											</div>
										</td>
									</tr>
								);
							})}

							{filteredLogs.length === 0 && !loading && (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
										No audit log events match the selected criteria.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default AuditLogs