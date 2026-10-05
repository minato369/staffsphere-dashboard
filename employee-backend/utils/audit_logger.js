import AuditLog from '../models/audit_log_model.js';

export const logActivity = async ({ action, req, targetId = null, targetName = null, details = '' }) => {
	try {
		await AuditLog.create({
			action,
			performerId: req.user.id,
			performerName: req.user.name || `User #${req.user.id}`,
			performerRole: req.user.role,
			targetId,
			targetName,
			details: typeof details === 'object' ? JSON.stringify(details) : details
		});
	} catch (error) {
		console.error('Failed to write audit log:', error.message);
	}
};