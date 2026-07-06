import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'
import Directory from './pages/Directory'

function App() {
	const { isAuthenticated, user, logout } = useAuth();
	// Tracking active view via a clean local layout string state
	const [currentView, setCurrentView] = useState('directory');
	console.log(user);
	
	// 1. Guard Check: If the user badge token doesn't exist, force Login View frame
	if (!isAuthenticated || !user) {
		return <Login />;
	}

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">

			{/* PERMANENT SIDEBAR CONTAINER (Matches the premium aesthetic) */}
			<aside className="w-64 bg-slate-950 text-white flex flex-col justify-between p-6 shrink-0 border-r border-slate-900 relative">
				{/* Background Ambient Depth Layer */}
				<div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#020617] z-0" />

				<div className="space-y-8 relative z-10">
					{/* Header Workspace Badge */}
					<div className="flex items-center gap-3 text-xl font-bold tracking-tight text-white">
						<div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
							<span className="text-xs text-white">S</span>
						</div>
						StaffSphere
					</div>

					{/* Internal Navigation Action Handles */}
					<nav className="flex flex-col gap-1.5">
						<button
							onClick={() => setCurrentView('directory')}
							className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${currentView === 'directory'
									? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
									: 'text-slate-400 hover:bg-white/5 hover:text-white'
								}`}
						>
							Employee Directory
						</button>
					</nav>
				</div>

				{/* Footer Active Profile Section */}
				<div className="border-t border-slate-900 pt-4 space-y-3 relative z-10">
					<div className="px-4">
						<div className="text-sm font-bold text-white truncate">{user?.name}</div>
						<div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-0.5">
							Role: {user?.role}
						</div>
					</div>
					<button
						onClick={logout}
						className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
					>
						Sign Out
					</button>
				</div>
			</aside>

			{/* DYNAMIC CONTENT CONTAINER FRAME */}
			<main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
				{/* Universal Sub-Header Dashboard Line */}
				<header className="bg-white border-b border-slate-200/80 px-8 py-4.5 flex items-center justify-between shrink-0">
					<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
						Secure Operational Cluster Matrix
					</span>
					<span className="text-xs font-mono font-bold text-slate-400">
						ID: #{user?.id}
					</span>
				</header>

				{/* Conditional View Node Component Injection */}
				<div className="p-8 flex-1 bg-slate-50">
					{currentView === 'directory' && <Directory />}
					{/* Add more page blocks here as we build them, e.g., currentView === 'profile' */}
				</div>
			</main>

		</div>
	)
}

export default App