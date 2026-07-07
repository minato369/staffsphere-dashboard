import express from 'express'
import { getAllEmployees, createEmployee, deleteEmployee } from '../controllers/employee_controller.js'
import { verifyToken , authorizeRoles} from '../middlewares/auth_middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllEmployees);
router.post('/', verifyToken, authorizeRoles('Admin', 'Manager'), createEmployee);

router.delete('/:id', verifyToken, deleteEmployee);

export default router;