import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Your Sequelize connection instance

const AuditLog = sequelize.define('AuditLog', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	action: {
		type: DataTypes.STRING,
		allowNull: false // e.g., "CREATE_EMPLOYEE", "UPDATE_EMPLOYEE", "DELETE_EMPLOYEE", "PROFILE_UPDATE"
	},
	performerId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	performerName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	performerRole: {
		type: DataTypes.STRING,
		allowNull: false
	},
	targetId: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	targetName: {
		type: DataTypes.STRING,
		allowNull: true
	},
	details: {
		type: DataTypes.TEXT, // Text field for MySQL / phpMyAdmin compatibility
		allowNull: true
	}
}, {
	tableName: 'audit_logs',
	timestamps: true // Automatically manages createdAt and updatedAt
});

export default AuditLog;