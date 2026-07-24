import express from 'express'
import { getAllEmployees, createEmployee, deleteEmployee, updateEmployee, updateMyProfile } from '../controllers/employee_controller.js'
import { verifyToken, authorizeRoles } from '../middlewares/auth_middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllEmployees);
router.post('/', verifyToken, authorizeRoles('Admin', 'Manager'), createEmployee);

// Self-service route (Requires authentication, accessible by all roles)
router.put('/me', verifyToken, updateMyProfile);

router.put('/:id', verifyToken, authorizeRoles('Admin', 'Manager'), updateEmployee);

router.delete('/:id', verifyToken, deleteEmployee);

export default router;