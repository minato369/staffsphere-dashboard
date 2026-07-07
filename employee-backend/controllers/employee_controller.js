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
		res.status(403).json({message:"Security breach block. Managers are restricted to creating standard Employee tiers only.", });
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

	res.status(201).json({message: `${role} record initialized successfully.`,
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
			return res.status(400).json({message: `The ${field} provided is already assigned to an employee.`,});
		}
		res.status(500).json({message: "Profile initialization failed.",error: error.message,});
	}
};

export const deleteEmployee = async(req,res) => {
	try{
		const {id} = req.params;
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
		
	}catch(error){
		res.status(500).json({
			message: "Profile deletion failed.",
			error: error.message,
		});
		
	}
}
