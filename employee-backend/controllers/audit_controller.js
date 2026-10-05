import AuditLog from '../models/audit_log_model.js';

export const getAuditLogs = async (req, res) => {
	try {
		const logs = await AuditLog.findAll({
			order: [['createdAt', 'DESC']],
			limit: 50
		});
		res.status(200).json(logs);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch audit logs", error: error.message });
	}
};