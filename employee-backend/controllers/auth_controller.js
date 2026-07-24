import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee.js';

//Login

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		const employee = await Employee.findOne({ where: { email: email } });
		if (!employee) {
			return res.status(404).json({ message: 'Employee not found' });
		}

		const isMatch = await bcrypt.compare(password, employee.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const secretKey = process.env.JWT_SECRET;

		const token = jwt.sign({
			id: employee.id,
			email: employee.id,
			role: employee.role
		},
			secretKey, { expiresIn: '24h' })
		res.status(200).json({
			message: 'Login successful',
			token,
			user: {
				id: employee.id,
				employeeId: employee.employeeId,
				name: employee.name,
				email: employee.email,
				phone: employee.phone || "",
				address: employee.address || "",
				role: employee.role,
				isInitialPassword: employee.isInitialPassword
			}
		});
	}
	catch (error) {
		res.status(500).json({ message: 'Authentication process crashed', error: error.message });
	}
}

export const changePassword = async (req, res) => {
	try {
		const userId = req.user.id;
		const { currentPassword, newPassword } = req.body

		if (!currentPassword || !newPassword) {
			return res.status(400).json({ message: "Both current and new passwords are required." });
		}

		if (newPassword.length < 6) {
			return res.status(400).json({ message: "New password must be at least 6 characters long." });
		}

		const employee = await Employee.findByPk(userId);

		if (!employee) {
			return res.status(404).json({ message: "Employee account not found." });
		}

		const isMatch = await bcrypt.compare(currentPassword, employee.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Current password provided is incorrect." });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		employee.password = hashedPassword;
		employee.isInitialPassword = false;

		await employee.save();

		res.status(200).json({
			message: "Password successfully updated. Security lock released.",
			user: {
				id: employee.id,
				employeeId: employee.employeeId,
				name: employee.name,
				email: employee.email,
				role: employee.role,
				isInitialPassword: false
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Ther has been error while chnaging the password: ', error: error.message });
	}
}