const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized, token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { protect };
