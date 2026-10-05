import express from 'express';
import { getAuditLogs } from '../controllers/audit_controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth_middleware.js';

const router = express.Router();

// Only Admins and Managers can inspect audit logs
router.get('/', verifyToken, authorizeRoles('Admin', 'Manager'), getAuditLogs);

export default router;