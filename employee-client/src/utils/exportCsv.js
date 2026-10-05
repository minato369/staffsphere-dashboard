const exportToCsv = (data, filename = 'staffsphere_employees.csv') => {
	if (!data || !data.length) return;

	// Define column headers and corresponding object keys
	const columns = [
		{ header: 'Employee ID', key: 'employeeId' },
		{ header: 'Full Name', key: 'name' },
		{ header: 'Email Address', key: 'email' },
		{ header: 'Role', key: 'role' },
		{ header: 'Phone', key: 'phone' },
		{ header: 'Address', key: 'address' },
		{ header: 'Joined At', key: 'createdAt' }
	];

	// Build the CSV header row
	const csvHeaders = columns.map(c => `"${c.header}"`).join(',');

	// Map each employee into a sanitized row string
	const csvRows = data.map(emp => {
		return columns.map(col => {
			let val = emp[col.key] ?? '';
			if (col.key === 'createdAt' && val) {
				val = new Date(val).toLocaleDateString();
			}
			// Escape double quotes to prevent CSV injection or malformed columns
			const sanitized = String(val).replace(/"/g, '""');
			return `"${sanitized}"`;
		}).join(',');
	});

	const csvContent = [csvHeaders, ...csvRows].join('\r\n');

	// Create a Blob with UTF-8 BOM so Excel opens special characters correctly
	const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	// Trigger programmatic download
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export default exportToCsv