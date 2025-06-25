const { User } = require('../models/users');

const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    // Validate required fields
    if (!username || !password || !email) {
        return res.status(400).json({ msg: 'Please enter all the fields' });
    }

    try {
        const newUser = await User.Create({
            username,
            password,
            email
        });

        // Don't return sensitive data like password
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            is_verified: newUser.is_verified,
            created_at: newUser.created_at
        };

        res.status(201).json({ 
            msg: 'User created successfully', 
            user: userResponse 
        });

    } catch (error) {
        console.log(error);
        
        // Handle specific database errors
        if (error.code === '23505') { // PostgreSQL unique violation
            return res.status(409).json({ 
                msg: 'User with this email or username already exists' 
            });
        }
        
        // Generic error response
        res.status(500).json({ 
            msg: 'Failed to create user. Please try again.' 
        });
    }
};


module.exports = { createUser };