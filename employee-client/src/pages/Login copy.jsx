import React, {useState} from 'react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
	const { login } = useAuth();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) =>{
		e.preventDefault();
		setError('');
		setIsSubmitting(true);
		try{
			const response = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body:JSON.stringify({email, password})
			})
			const data = await response.json();
			if(!response.ok){
				throw new Error(data.message || 'Authentication checkpoint validation failed.');
			}

			login(data.user, data.token)
			console.log("user logged in successfully")
		}catch(error){
			setError(error.message);
		}finally{
		setIsSubmitting(false)
		}
	}
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-200/60">
				<div>
					<h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-brand-primary">
						Staff Sphere
					</h2>
					<p className="mt-2 text-center text-sm text-slate-600">
						Secure Infrastructure Gateway Sign-In
					</p>
				</div>

				{error && (
					<div className="rounded-md bg-red-50 p-4 border border-red-200">
						<p className="text-sm font-medium text-red-800 text-center">{error}</p>
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4 rounded-md">
						<div>
							<label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
								Corporate Email Address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 transition placeholder:text-slate-400 focus:border-brand-accent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm"
								placeholder="name@company.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
								Security Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 transition placeholder:text-slate-400 focus:border-brand-accent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="group relative flex w-full justify-center rounded-lg bg-brand-accent px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
						>
							{isSubmitting ? 'Verifying Credentials...' : 'Authenticate Access'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login