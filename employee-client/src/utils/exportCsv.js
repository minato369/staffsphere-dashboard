const exportToCsv = (data, filename = 'staffsphere_employees.csv') => {
	if (!data || !data.length) return;

	const columns = [
		{ header: 'Employee ID', key: 'employeeId' },
		{ header: 'Full Name', key: 'name' },
		{ header: 'Corporate Email', key: 'email' },
		{ header: 'Role', key: 'role' },
		{ header: 'Department', key: 'department' },
		{ header: 'Phone', key: 'phone' },
		{ header: 'Address', key: 'address' },
		{ header: 'Joined At', key: 'createdAt' }
	];

	const csvHeaders = columns.map(c => `"${c.header}"`).join(',');

	const csvRows = data.map(emp => {
		return columns.map(col => {
			let val = emp[col.key] ?? '';
			if (col.key === 'createdAt' && val) {
				val = new Date(val).toLocaleDateString();
			}
			if (col.key === 'department' && !val) {
				val = 'Engineering';
			}
			const sanitized = String(val).replace(/"/g, '""');
			return `"${sanitized}"`;
		}).join(',');
	});

	const csvContent = [csvHeaders, ...csvRows].join('\r\n');
	const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export default exportToCsv;