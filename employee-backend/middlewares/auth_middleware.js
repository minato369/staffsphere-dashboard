import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const verifyToken = async(req,res,next)=>{ 
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if(!token) return res.status(401).json({message: 'Unable to authorized'});

	try{
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	}catch(error){
		return res.status(400).json({message: 'Invalid token'});
	
	}

}

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ 
				message: `Access denied. Your role (${req.user.role}) does not have permission to perform this action.` 
			});
		}
		next();
	};
};