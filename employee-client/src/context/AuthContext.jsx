import React, { useState, useEffect, createContext } from 'react'
import { useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(localStorage.getItem('ss_token') || null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const savedUser = localStorage.getItem('ss_user');
		if (token && savedUser) {

			try {
				setUser(JSON.parse(savedUser))
			} catch (error) {
				console.log(error)
				logout()
			}

		}

		if (token && !savedUser) {
			logout()
		}

		if (!token && savedUser) {
			logout()
		}

		setLoading(false)
	}, [token])


	const login = (userData, jwtToken) => {
		localStorage.setItem('ss_token', jwtToken)
		localStorage.setItem('ss_user', JSON.stringify(userData))
		setToken(jwtToken)
		setUser(userData)
	}

	const logout = () => {
		localStorage.removeItem('ss_token')
		localStorage.removeItem('ss_user')
		setToken(null)
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be nested within an AuthProvider structural container.');
	return context;
}
