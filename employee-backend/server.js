import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import sequelize from './config/database.js'
import Employee from './models/employee.js';
import employeeRoutes from './routes/employee_route.js';
import authRoutes from './routes/auth_route.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//Api Endpoints
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

// Make sure admin will never get deleted

const seedRootAdmin = async () => {
    try {
        const adminExist = await Employee.findOne({ where: { role: 'Admin' } });

        if (!adminExist) {
            console.log("No administrator detected. Securing slot ID 1 for Root Admin...");
            
            const hashedPassword = await bcrypt.hash('password', 10);
            
            // 1. Create the root admin locked strictly to ID 1
            await Employee.create({
                id: 1, // Enforce ID 1
                employeeId: "EMP-ADMIN-001",
                name: "Administrator",
                email: "Admin@gmail.com",
                password: hashedPassword,
                role: "Admin",
                isInitialPassword: false
            });

            // 2. Force MariaDB to start all future automatic employee IDs from 2 onwards
            await sequelize.query("ALTER TABLE Employees AUTO_INCREMENT = 2;");
            
            console.log("Admin locked at ID 1! Future entries will start at ID 2. (User: Admin@gmail.com / Pass: password)");
        } else {
            console.log("Administrator account verified active at slot ID 1.");
        }
    } catch (error) {
        console.error('Failed to verify admin account:', error.message);
    }
};
//API ENDPOINTS


app.get('/', (req,res)=>{
		const message = 'Welcome to employee backend';
		res.json({message:message})
		console.log(message)
})

sequelize.sync({alter:true}).then(async()=>{
		console.log('Database synced');
		await seedRootAdmin();
		app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`))
	}).catch(err => {
		console.error('✗ Database synchronization crashed:', err.message);
});


app.listen(PORT, () => {
	console.log(`Isolated test server running on http://localhost:${PORT}`);
});