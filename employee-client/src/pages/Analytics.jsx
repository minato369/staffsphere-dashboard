import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import {
	Users,
	ShieldCheck,
	Briefcase,
	UserCheck,
	PieChart,
	TrendingUp,
	Activity,
	Layers
} from 'lucide-react';

export default function Analytics() {
	const [employees, setEmployees] = useState([]);
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadMetrics = async () => {
			try {
				const [empData, logData] = await Promise.all([
					employeeAPI.getAll(),
					employeeAPI.getLogs().catch(() => [])
				]);
				setEmployees(Array.isArray(empData) ? empData : empData.employees || []);
				setLogs(Array.isArray(logData) ? logData : []);
			} finally {
				setLoading(false);
			}
		};
		loadMetrics();
	}, []);

	const totalStaff = employees.length || 1;
	const adminCount = employees.filter(e => e.role === 'Admin').length;
	const managerCount = employees.filter(e => e.role === 'Manager').length;
	const staffCount = employees.filter(e => e.role === 'Employee').length;

	const adminPct = Math.round((adminCount / totalStaff) * 100);
	const managerPct = Math.round((managerCount / totalStaff) * 100);
	const staffPct = Math.max(0, 100 - adminPct - managerPct);

	// SVG Donut calculation constants
	const radius = 40;
	const circumference = 2 * Math.PI * radius; // ~251.32
	const adminStroke = (adminPct / 100) * circumference;
	const managerStroke = (managerPct / 100) * circumference;
	const staffStroke = (staffPct / 100) * circumference;

	// Operational Actions Breakdown from MySQL Audit Logs
	const createLogs = logs.filter(l => l.action === 'CREATE_EMPLOYEE').length;
	const updateLogs = logs.filter(l => l.action === 'UPDATE_EMPLOYEE' || l.action === 'PROFILE_UPDATE').length;
	const deleteLogs = logs.filter(l => l.action === 'DELETE_EMPLOYEE').length;

	if (loading) {
		return <div className="text-sm text-slate-500 font-medium p-8">Aggregating workspace analytics...</div>;
	}

	return (
		<div className="space-y-8 max-w-7xl mx-auto">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-950 flex items-center gap-2.5">
					<TrendingUp className="w-7 h-7 text-indigo-600" />
					Operational Intelligence & Metrics
				</h1>
				<p className="text-sm text-slate-500 font-medium mt-0.5">
					Real-time workforce distribution, privilege ratios, and mutation velocity across StaffSphere.
				</p>
			</div>

			{/* Quick KPI Stat Highlights */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
					<div className="flex items-center justify-between text-slate-400">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Workforce</span>
						<Users className="w-5 h-5 text-indigo-600" />
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950">{employees.length}</span>
						<span className="text-xs font-semibold text-emerald-600">Active Directory</span>
					</div>
				</div>

				<div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
					<div className="flex items-center justify-between text-slate-400">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Privileged Ratio</span>
						<ShieldCheck className="w-5 h-5 text-purple-600" />
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950">{adminPct + managerPct}%</span>
						<span className="text-xs font-semibold text-slate-500">Admins & Managers</span>
					</div>
				</div>

				<div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
					<div className="flex items-center justify-between text-slate-400">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Logged Events</span>
						<Activity className="w-5 h-5 text-amber-600" />
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950">{logs.length}</span>
						<span className="text-xs font-semibold text-slate-500">Audit Trail Entries</span>
					</div>
				</div>

				<div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
					<div className="flex items-center justify-between text-slate-400">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Staff-to-Manager</span>
						<Briefcase className="w-5 h-5 text-emerald-600" />
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-extrabold text-slate-950">
							{managerCount > 0 ? (staffCount / managerCount).toFixed(1) : staffCount}:1
						</span>
						<span className="text-xs font-semibold text-slate-500">Span of Control</span>
					</div>
				</div>
			</div>

			{/* Visual Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

				{/* 1. Role Distribution Donut Card */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between">
							<h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
								<PieChart className="w-4 h-4 text-indigo-600" />
								Access Clearance Breakdown
							</h2>
							<span className="text-xs font-semibold text-slate-400">By System Role</span>
						</div>
						<p className="text-xs text-slate-500 mt-1">
							Relative representation of operational clearance levels.
						</p>
					</div>

					<div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6">
						{/* SVG Donut */}
						<div className="relative w-44 h-44 shrink-0">
							<svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
								{/* Base track */}
								<circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />

								{/* Employee Ring (Indigo) */}
								<circle
									cx="50"
									cy="50"
									r={radius}
									fill="none"
									stroke="#6366f1"
									strokeWidth="12"
									strokeDasharray={`${staffStroke} ${circumference}`}
									strokeDashoffset="0"
									strokeLinecap="round"
								/>

								{/* Manager Ring (Emerald) */}
								<circle
									cx="50"
									cy="50"
									r={radius}
									fill="none"
									stroke="#10b981"
									strokeWidth="12"
									strokeDasharray={`${managerStroke} ${circumference}`}
									strokeDashoffset={-staffStroke}
								/>

								{/* Admin Ring (Purple) */}
								<circle
									cx="50"
									cy="50"
									r={radius}
									fill="none"
									stroke="#9333ea"
									strokeWidth="12"
									strokeDasharray={`${adminStroke} ${circumference}`}
									strokeDashoffset={-(staffStroke + managerStroke)}
								/>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-2xl font-black text-slate-950">{employees.length}</span>
								<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Members</span>
							</div>
						</div>

						{/* Legend */}
						<div className="space-y-3 w-full sm:w-auto">
							<div className="flex items-center justify-between sm:justify-start gap-4">
								<div className="flex items-center gap-2">
									<span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
									<span className="text-xs font-bold text-slate-700">Admins</span>
								</div>
								<span className="text-xs font-mono font-semibold text-slate-500">{adminCount} ({adminPct}%)</span>
							</div>

							<div className="flex items-center justify-between sm:justify-start gap-4">
								<div className="flex items-center gap-2">
									<span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
									<span className="text-xs font-bold text-slate-700">Managers</span>
								</div>
								<span className="text-xs font-mono font-semibold text-slate-500">{managerCount} ({managerPct}%)</span>
							</div>

							<div className="flex items-center justify-between sm:justify-start gap-4">
								<div className="flex items-center gap-2">
									<span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
									<span className="text-xs font-bold text-slate-700">Employees</span>
								</div>
								<span className="text-xs font-mono font-semibold text-slate-500">{staffCount} ({staffPct}%)</span>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 text-center sm:text-left">
						Admins and Managers control provisioning; employees retain self-service rights.
					</div>
				</div>

				{/* 2. Audit Event Activity Velocity */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between">
							<h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
								<Layers className="w-4 h-4 text-indigo-600" />
								Operational Mutation Ratios
							</h2>
							<span className="text-xs font-semibold text-slate-400">MySQL Audit Logs</span>
						</div>
						<p className="text-xs text-slate-500 mt-1">
							Frequency of writes, modifications, and deletions recorded in MySQL.
						</p>
					</div>

					<div className="space-y-4 my-6">
						{/* Creates Bar */}
						<div>
							<div className="flex justify-between text-xs font-semibold mb-1.5">
								<span className="text-slate-700">Profile Initializations (CREATE)</span>
								<span className="text-slate-500">{createLogs} events</span>
							</div>
							<div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
								<div
									className="bg-emerald-500 h-full rounded-full transition-all duration-500"
									style={{ width: `${logs.length ? (createLogs / logs.length) * 100 : 0}%` }}
								/>
							</div>
						</div>

						{/* Updates Bar */}
						<div>
							<div className="flex justify-between text-xs font-semibold mb-1.5">
								<span className="text-slate-700">Modifications & Self-Edits (UPDATE)</span>
								<span className="text-slate-500">{updateLogs} events</span>
							</div>
							<div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
								<div
									className="bg-indigo-600 h-full rounded-full transition-all duration-500"
									style={{ width: `${logs.length ? (updateLogs / logs.length) * 100 : 0}%` }}
								/>
							</div>
						</div>

						{/* Deletions Bar */}
						<div>
							<div className="flex justify-between text-xs font-semibold mb-1.5">
								<span className="text-slate-700">Purged Offboardings (DELETE)</span>
								<span className="text-slate-500">{deleteLogs} events</span>
							</div>
							<div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
								<div
									className="bg-red-500 h-full rounded-full transition-all duration-500"
									style={{ width: `${logs.length ? (deleteLogs / logs.length) * 100 : 0}%` }}
								/>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 text-center sm:text-left">
						Total captured ledger entries: <strong className="text-slate-700">{logs.length}</strong> records.
					</div>
				</div>

			</div>
		</div>
	);
}