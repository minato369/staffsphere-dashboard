import React, { useState, useEffect } from 'react'
import { employeeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddEmployeeModal = ({ isOpen, onClose, onRefresh }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [role, setRole] = useState('Employee');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync role state options if a Manager opens the panel
    useEffect(() => {
        if (user?.role === 'Manager') {
            setRole('Employee');
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await employeeAPI.create({ employeeId, name, email, password, role });

            setName('');
            setEmail('');
            setPassword('');
            setEmployeeId('');
            setRole('Employee');
            onRefresh();
            onClose();
            
        } catch (err) {
            setError(err.message || 'Failed to register record.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs font-sans">
            {/* Backdrop Dismiss Click Handle Area */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Slide-out Menu Panel container */}
            <div className="relative z-10 h-full w-full max-w-md bg-white p-8 shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-slide-in">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-950">Add New Employee</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Initialize a new secure corporate identity profile.</p>
                        </div>
                        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* 🛠️ ADDED: Premium High-Contrast Validation Warning Banner */}
                    {error && (
                        <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 border border-red-200/60 animate-in fade-in duration-200">
                            <div className="shrink-0 text-red-500 mt-0.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                                    Registration Conflict
                                </h4>
                                <p className="text-xs font-semibold text-red-700/90 leading-relaxed">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    <form id="add-employee-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">Custom Employee ID</label>
                            <input
                                type="text"
                                required
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs"
                                placeholder="e.g., EMP-2026-089"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">Corporate Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">Temporary Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">Access Privilege Role</label>

                            {user?.role === 'Manager' ? (
                                <input
                                    type="text"
                                    readOnly
                                    value="Employee"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 font-semibold focus:outline-none"
                                />
                            ) : (
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-xs cursor-pointer"
                                >
                                    <option value="Employee">Employee (Standard Access)</option>
                                    <option value="Admin">Admin (Full Control Executive)</option>
                                </select>
                            )}
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-employee-form"
                        disabled={isSubmitting}
                        className="w-1/2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? 'Creating...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddEmployeeModal;