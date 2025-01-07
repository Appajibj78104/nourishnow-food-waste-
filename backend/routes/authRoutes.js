const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {register, login} = require('../controllers/authController')
// Login route
// router.post('/login', async (req, res) => {
//     try {
//         // Debug log
//         console.log('Login request received:', {
//             body: req.body,
//             headers: req.headers
//         });

//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             console.log('Missing credentials');
//             return res.status(400).json({ 
//                 message: 'Email and password are required' 
//             });
//         }

//         // Find user
//         const user = await User.findOne({ email });
//         console.log('User found:', user ? 'Yes' : 'No');

//         if (!user) {
//             return res.status(401).json({ 
//                 message: 'Invalid email or password' 
//             });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('Password match:', isMatch ? 'Yes' : 'No');

//         if (!isMatch) {
//             return res.status(401).json({ 
//                 message: 'Invalid email or password' 
//             });
//         }

//         // Create token
//         const token = jwt.sign(
//             { 
//                 userId: user._id,
//                 role: user.role 
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         // Send response
//         const response = {
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         };

//         console.log('Sending successful response:', response);
//         res.json(response);

//     } catch (error) {
//         console.error('Server error during login:', error);
//         res.status(500).json({ 
//             message: 'An error occurred during login' 
//         });
//     }
// });

router.post('/register',register);
router.post('/login', login)
module.exports = router;