import Employee from "../models/employee.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get All employees

export const getAllEmployees = async (req, res) => {
	try {
		const employees = await Employee.findAll();
		res.status(200).json(employees);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching directory",
			error: error.message,
		});
	}
};

// Create new Employee

export const createEmployee = async (req, res) => {
	try {
		const { employeeId, name, email, password, role, phone, address, avatar } = req.body;
		const creatorRole = req.user.role; // Gathered from our verifyToken middleware payload

		// Basic Validation Check
		if (!employeeId || !name || !email || !password || !role) {
			return res.status(400).json({ message: "Missing mandatory registration profile fields." });
		}

		// RULE 1 & 2 ENFORCEMENT: Managers can ONLY create standard 'Employee' profiles.
		// Only 'Admin' accounts can create other 'Admin' or 'Manager' clearance records.

		if (creatorRole === "Manager" && role !== "Employee") {
			res.status(403).json({ message: "Security breach block. Managers are restricted to creating standard Employee tiers only.", });
		}

		// Securely hash the initial password
		const hashedPassword = await bcrypt.hash(password, 10);

		const newEmployee = await Employee.create({
			employeeId,
			name,
			email,
			password: hashedPassword,
			role,
			phone,
			address,
			avatar,
			isInitialPassword: true, // Rule 5: True until the employee logs in and performs a self-reset
		});

		res.status(201).json({
			message: `${role} record initialized successfully.`,
			employee: {
				id: newEmployee.id,
				employeeId: newEmployee.employeeId,
				name: newEmployee.name,
				role: newEmployee.role,
				email: newEmployee.email,
				phone: newEmployee.phone,
				address: newEmployee.address,
				avatar: newEmployee.avatar,
			},
		});

	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			const field = error.errors[0].path;
			return res.status(400).json({ message: `The ${field} provided is already assigned to an employee.`, });
		}
		res.status(500).json({ message: "Profile initialization failed.", error: error.message, });
	}
};

export const deleteEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const operatorRole = req.user.role;
		const operatorId = req.user.id;

		const employeeToDelete = await Employee.findByPk(id);

		// 1. Fetch target profile to check roles before destroying it
		if (!employeeToDelete) {
			return res.status(404).json({ message: "Target employee profile not found." });
		}

		// 2. Self-Deletion Shield Safeguard
		if (Number(operatorId) === Number(employeeToDelete.id)) {
			return res.status(400).json({ message: "Security restriction: You cannot delete your own account." });
		}

		if (operatorRole === "Manager" && employeeToDelete.role !== "Employee") {
			return res.status(403).json({
				message: "Privilege breach block: Managers can only offboard standard Employee tiers."
			});
		}

		await employeeToDelete.destroy();

		res.status(200).json({ message: "Profile successfully purged from directory database stack." });

	} catch (error) {
		res.status(500).json({
			message: "Profile deletion failed.",
			error: error.message,
		});

	}
}

export const updateEmployee = async (req, res) => {
	try {

		const { id } = req.params;
		const operatorRole = req.user.role;
		const { name, email, role, phone, address, avatar } = req.body;

		const employee = await Employee.findByPk(id);

		if (!employee) {
			return res.status(404).json({ message: "Target employee profile not found." });
		}

		if (operatorRole === "Manager" && employee.role === "Admin") {
			return res.status(403).json({
				message: "Security restriction: Managers cannot modify System Admin profiles."
			});
		}

		if (email && email !== employee.email && operatorRole !== "Admin") {
			return res.status(403).json({
				message: "Privilege restriction: Only System Admins can modify corporate email handles."
			});
		}

		if (role && role !== employee.role && operatorRole !== "Admin") {
			return res.status(403).json({
				message: "Privilege restriction: Only System Admins can alter access privilege roles."
			});
		}

		employee.name = name || employee.name;
		employee.phone = phone !== undefined ? phone : employee.phone;
		employee.address = address !== undefined ? address : employee.address;
		employee.avatar = avatar !== undefined ? avatar : employee.avatar;

		if (operatorRole === "Admin") {
			if (email) employee.email = email;
			if (role) employee.role = role;
		}

		await employee.save();

		res.status(200).json({
			message: "Employee profile successfully updated.",
			employee: {
				id: employee.id,
				employeeId: employee.employeeId,
				name: employee.name,
				email: employee.email,
				role: employee.role,
				phone: employee.phone,
				address: employee.address,
				avatar: employee.avatar
			}
		});
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({ message: "The email address provided is already in use by another profile." });
		}

		res.status(500).json({
			message: "Profile update failed.",
			error: error.message
		});
	}
};

export const updateMyProfile = async (req, res) => {
	try {
		console.log('here');

		const userId = req.user.id; // Extracted from verified JWT token
		const { phone, address, avatar } = req.body;
		const employee = await Employee.findByPk(userId);
		if (!employee) {
			return res.status(404).json({ message: "Profile not found." });
		}

		// Employees can ONLY update non-sensitive personal contact info
		employee.phone = phone !== undefined ? phone : employee.phone;
		employee.address = address !== undefined ? address : employee.address;
		employee.avatar = avatar !== undefined ? avatar : employee.avatar;

		await employee.save();

		res.status(200).json({
			message: "Personal profile updated successfully.",
			employee: {
				id: employee.id,
				employeeId: employee.employeeId,
				name: employee.name,
				email: employee.email,
				role: employee.role,
				phone: employee.phone,
				address: employee.address,
				avatar: employee.avatar
			}
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to update profile.",
			error: error.message
		});
	}
};