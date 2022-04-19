const jwt = require('jsonwebtoken');
const User = require('../models/users');

const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			//get token from header
			token = req.headers.authorization.split(' ')[1];
            
			//verify token
			console.log("verifying token")
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log("verified token")

			//get user from the token
			try {
				console.log("finding user", decoded.id)
				req.user = await User.findOne({
					where: {
						id: decoded.id
					}
				});
				console.log("found user", req.user)
			} catch (error) {
				res.status(500).json({message: 'user not found'});			
			}

			next();
		} catch (error) {
			res.status(401).json({message: 'not authorized'});
		}
	}

	if (!token) {
		res.status(401).json({ message: 'Not authorized: no token' });	
	}
};

module.exports = {
	protect
};