const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
	const token = localStorage.getItem("ss_token");

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
};

export const employeeAPI = {
	getAll: async () => {
		const response = await fetch(`${BASE_URL}/employees`, {
			method: "GET",
			headers: getHeaders(),
		});
		if (!response) throw new Error("Failed to load employee records.");
		return response.json();
	},

	create: async (employeeData) => {
		const response = await fetch(`${BASE_URL}/employees`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(employeeData),
		});

		const data = await response.json();

		console.log(data);
		
		if (!response.ok) {
			throw new Error(
				data.message || "This Email or Employee ID is already registered.",
			);
		}
		if (!response) throw new Error("Failed to create employee record.");
		return data;
	},

	delete: async (id) => {
		const response = await fetch(`${BASE_URL}/employees/${id}`, {
		method: 'DELETE',
		headers: getHeaders()
	});
	console.log(response);
	
	// If the server rejects the deletion request, catch and throw the error reason
	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.message || 'Administrative rejection: Failed to remove user record.');
	}

	return true;
	}
};
