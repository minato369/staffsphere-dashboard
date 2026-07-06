import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
	const { login } = useAuth();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);
		try {
			const response = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password })
			})
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Authentication checkpoint validation failed.');
			}

			login(data.user, data.token)
			console.log("user logged in successfully")
		} catch (error) {
			setError(error.message);
		} finally {
			setIsSubmitting(false)
		}
	}
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4 font-sans">
			{/* Container card matching the rounded canvas from ChatGPT Image Jul 4, 2026, 11_16_12 PM.png */}
			<div className="flex w-full max-w-[1200px] min-h-[780px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">

				{/* LEFT SIDE: Deep Textured Interactive Feature Hero Panel */}
				<div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white relative bg-slate-950">
					{/* Layered rich radial & linear ambient gradients to replicate the image depth */}
					<div className="absolute inset-0 bg-gradient-to-b from-[#1d1b4b] via-[#0f172a] to-[#020617] z-0" />
					<div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-purple-600/20 via-blue-600/10 to-transparent blur-xl z-0" />

					{/* Top Header Logo Row */}
					<div className="flex items-center gap-3 relative z-10">
						<div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-sm">
							<svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-3.076l-1.3-.835.219-.53a4.75 4.75 0 00-.325-4.184l-.853-1.393a4.75 4.75 0 00-4.231-2.333H9.156a4.75 4.75 0 00-4.232 2.333l-.853 1.393a4.75 4.75 0 00-.325 4.184l.219.53-1.3.835A4.125 4.125 0 00.5 15.471Q.5 17 2 18h1.5" />
							</svg>
						</div>
						<span className="text-xl font-bold tracking-wider text-white">EMS</span>
					</div>

					{/* Core Central Value Proposition Title Layer */}
					<div className="relative z-10 max-w-md space-y-6 my-auto">
						<div className="space-y-2">
							<h1 className="text-5xl font-bold tracking-tight text-white leading-[1.15]">
								Employee <br />
								<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Management</span> <br />
								System
							</h1>
							<div className="w-12 h-[3px] bg-blue-500 rounded-full mt-4" />
						</div>
						<p className="text-slate-400 text-sm leading-relaxed font-normal max-w-sm">
							Streamline your workforce. <br />
							Boost productivity. Manage with ease.
						</p>
					</div>

					{/* Bottom Row Horizontal Highlights Matrix Grid */}
					<div className="grid grid-cols-3 gap-4 relative z-10 pt-6 border-t border-white/5">
						{/* Feature Item 1 */}
						<div className="space-y-2">
							<div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
								<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
							</div>
							<div className="text-xs font-semibold text-white">Manage</div>
							<div className="text-[10px] text-slate-500">Employees</div>
						</div>

						{/* Feature Item 2 */}
						<div className="space-y-2">
							<div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
								<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
							</div>
							<div className="text-xs font-semibold text-white">Track</div>
							<div className="text-[10px] text-slate-500">Performance</div>
						</div>

						{/* Feature Item 3 */}
						<div className="space-y-2">
							<div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
								<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
							</div>
							<div className="text-xs font-semibold text-white">Organize</div>
							<div className="text-[10px] text-slate-500">Workflows</div>
						</div>
					</div>
				</div>

				{/* RIGHT SIDE: Dedicated White Portal Entry Pane */}
				<div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-20 bg-white">
					<div className="w-full max-w-md mx-auto space-y-7">

						{/* Context Heading Group */}
						<div className="text-center space-y-1">
							<h2 className="text-3xl font-bold text-slate-950 tracking-tight">Welcome Back</h2>
							<p className="text-sm text-slate-500 font-medium">Sign in to your account</p>
						</div>

						{error && (
							<div className="rounded-xl bg-red-50 p-4 border border-red-100 text-sm font-medium text-red-600 text-center animate-pulse">
								{error}
							</div>
						)}

						{/* Main Operational Entry Fields Form */}
						<form className="space-y-4" onSubmit={handleSubmit}>

							{/* Email Container Input Block */}
							<div className="space-y-1.5">
								<label className="block text-xs font-semibold text-slate-700">Email</label>
								<div className="relative">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
									</span>
									<input
										type="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 shadow-xs"
										placeholder="Enter your email"
									/>
								</div>
							</div>

							{/* Password Container Input Block */}
							<div className="space-y-1.5">
								<label className="block text-xs font-semibold text-slate-700">Password</label>
								<div className="relative">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-4.25 3h17.5c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125H3.375a1.125 1.125 0 01-1.125-1.125v-5.25c0-.621.504-1.125 1.125-1.125z" /></svg>
									</span>
									<input
										type="password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 shadow-xs"
										placeholder="Enter your password"
									/>
									<span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 cursor-pointer hover:text-slate-600">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
									</span>
								</div>
							</div>
							
							{/* Submit Trigger Execution Action */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer mt-2"
							>
								{isSubmitting ? 'Signing In...' : 'Sign In'}
							</button>
						</form>

						{/* Split Decorative Divider Element */}
						{/* <div className="relative flex py-1 items-center">
							<div className="flex-grow border-t border-slate-200"></div>
							<span className="flex-shrink mx-4 text-xs font-medium text-slate-400">or continue with</span>
							<div className="flex-grow border-t border-slate-200"></div>
						</div> */}

						{/* OAuth Single Sign-On Grid Controls */}
						{/* <div className="grid grid-cols-2 gap-3">
							<button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-xs">
								<svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.315 1.886-2.135 5.542-6.887 5.542-4.09 0-7.43-3.39-7.43-7.57s3.34-7.57 7.43-7.57c2.33 0 3.89.97 4.78 1.83l3.26-3.14C18.23 1.57 15.48 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.975 0-.745-.08-1.315-.175-1.785H12.24z" /></svg>
								Google
							</button>
							<button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-xs">
								<svg className="w-4 h-4" viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h11v11H0z" /><path fill="#7fba00" d="M12 0h11v11H12z" /><path fill="#01a4ef" d="M0 12h11v11H0z" /><path fill="#ffb900" d="M12 12h11v11H12z" /></svg>
								Microsoft
							</button>
						</div> */}
					</div>
				</div>

			</div>
		</div>
	)
}

export default Login