const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock user data
const mockUsers = [
    {
        username: 'user1',
        // Password: 'password123' (hashed)
        password: '$2b$10$V9DPoPAvm13TT83CMd/iXeWcBaQ.4fi9Z4GFtq8VQ1yHl4h6vnQpG',
    },
    {
        username: 'user2',
        // Password: 'secret456' (hashed)
        password: '$2b$10$x.OuhEilFMGBx1ef1dwE/OGGmGgM/0rD6Op4p7YfHeN5GoAhqkiQS',
    }
];

// Secret key for JWT
const jwtSecret = 'your_jwt_secret';

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = mockUsers.find((user) => user.username === username);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
