const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/fileHandler');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');

const generateToken = (id, name, role) => {
    return jwt.sign({ id, name, role }, process.env.JWT_SECRET || 'nexus_dev_secret_key', {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        const users = await readData('users.json');

        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            subscription: 'Free', // Injected Tier System
            profileImage: '',
            followers: [],
            following: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeData('users.json', users);

        // Broadcast HTML Welcome via Resend Automation
        const welcomeHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #3b82f6;">Welcome to Neural Nexus, ${newUser.name}! 🚀</h1>
                <p>Your unique identifier has been permanently instantiated in the platform.</p>
                <p>Return to the portal to finalize your network configuration and begin broadcasting to the community.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #888;">Neural Nexus Administration</p>
            </div>
        `;
        sendEmail(newUser.email, 'Welcome to Neural Nexus 🚀', welcomeHtml).catch(console.error);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            subscription: newUser.subscription,
            token: generateToken(newUser.id, newUser.name, newUser.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await readData('users.json');
        const user = users.find(u => u.email === email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription || 'Free',
                profileImage: user.profileImage,
                token: generateToken(user.id, user.name, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};

exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: 'Identity Token required.' });

    try {
        const { verifyGoogleToken } = require('../utils/googleAuth');
        let payload = null;

        if (process.env.GOOGLE_CLIENT_ID) {
            payload = await verifyGoogleToken(token);
        } else {
            // Fallback parsing if testing exclusively locally dynamically
            payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        }

        const { name, email, picture } = payload;
        const users = await readData('users.json');
        let user = users.find(u => u.email === email);

        if (user) {
            // Identity Returning - Login Seamlessly
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription || 'Free',
                profileImage: user.profileImage || picture,
                token: generateToken(user.id, user.name, user.role)
            });
        } else {
            // Identity New - Register Silently
            const newPassword = crypto.randomBytes(16).toString('hex');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const newUser = {
                id: crypto.randomUUID(),
                name,
                email,
                password: hashedPassword,
                role: 'user',
                subscription: 'Free',
                profileImage: picture || '',
                followers: [],
                following: [],
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            await writeData('users.json', users);

            const welcomeHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #3b82f6;">Welcome to Neural Nexus, ${newUser.name}! 🚀</h1>
                    <p>Your identity has been authenticated via OAuth bridge.</p>
                    <p>Return to the portal to finalize your network configuration and begin broadcasting to the community.</p>
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">Neural Nexus Administration</p>
                </div>
            `;
            sendEmail(newUser.email, 'Welcome to Neural Nexus 🚀', welcomeHtml).catch(console.error);

            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                subscription: newUser.subscription,
                profileImage: newUser.profileImage,
                token: generateToken(newUser.id, newUser.name, newUser.role)
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Google authentication failed. Please try again.' });
    }
};
