const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
	const token = localStorage.getItem("ss_token");
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
};

export const employeeAPI = {
	// 📋 Fetch all directory profiles
	getAll: async () => {
		const response = await fetch(`${BASE_URL}/employees`, {
			method: "GET",
			headers: getHeaders(),
		});
		if (!response.ok) throw new Error("Failed to load employee records.");
		return response.json();
	},

	// ➕ Create new employee
	create: async (employeeData) => {
		const response = await fetch(`${BASE_URL}/employees`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(employeeData),
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(
				data.message || "This Email or Employee ID is already registered."
			);
		}
		return data;
	},

	// ❌ Purge / Delete employee
	delete: async (id) => {
		const response = await fetch(`${BASE_URL}/employees/${id}`, {
			method: "DELETE",
			headers: getHeaders(),
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			throw new Error(
				data.message || "Administrative rejection: Failed to remove user record."
			);
		}
		return true;
	},

	// ✏️ Admin / Manager update target profile
	updateEmployee: async (id, employeeData) => {
		const response = await fetch(`${BASE_URL}/employees/${id}`, {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(employeeData),
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Failed to update employee profile.");
		}
		return data;
	},

	// 🔒 Security credential password update
	changePassword: async (currentPassword, newPassword) => {
		const response = await fetch(`${BASE_URL}/auth/change-password`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify({ currentPassword, newPassword }),
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Failed to update credentials.");
		}
		return data;
	},

	// 👤 Self-service profile contact info update
	updateMyProfile: async (profileData) => {
		const response = await fetch(`${BASE_URL}/employees/me`, {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(profileData),
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.message || "Failed to update profile.");
		return data;
	},

	// 📜 Fetch recent audit activity logs
	getLogs: async () => {
		const response = await fetch(`${BASE_URL}/audit-logs`, {
			method: "GET",
			headers: getHeaders(),
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.message || "Failed to fetch audit logs.");
		return data;
	},
};

// 💡 Alias export so AuditLogs.jsx can import either `auditAPI` or `employeeAPI`
export const auditAPI = {
	getLogs: employeeAPI.getLogs,
};