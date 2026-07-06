import express from 'express'
import { getAllEmployees, createEmployee } from '../controllers/employee_controller.js'
import { verifyToken , authorizeRoles} from '../middlewares/auth_middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllEmployees);
router.post('/', verifyToken, authorizeRoles('Admin', 'Manager'), createEmployee);

export default router;