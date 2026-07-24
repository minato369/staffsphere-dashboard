import express from 'express';
import { login, changePassword } from '../controllers/auth_controller.js';
import { verifyToken } from '../middlewares/auth_middleware.js';


const router = express.Router();

router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);

export default router;
