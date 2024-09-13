const jwt = require('jsonwebtoken');
const SECRET_KEY = 'hatio-key';

const authMiddleware = (req, res, next) => {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId; 
        next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(400).json({ message: 'Invalid token', error });
    }
};

module.exports = authMiddleware;
