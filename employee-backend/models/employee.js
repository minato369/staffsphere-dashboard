import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

//Define Our models
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Manager', 'Employee'),
    allowNull: false,
    defaultValue: 'Employee'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default-avatar.png'
  },
  isInitialPassword: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // Rule 5: True until they change it themselves
  }
}, {
  timestamps: true
});

export default Employee;
