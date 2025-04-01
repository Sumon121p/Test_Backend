const User = require('../Model/User.model');

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, phoneNumber, address, dateOfBirth, profileImage, role, isActive } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already in use' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password,
            phoneNumber,
            address,
            dateOfBirth,
            profileImage,
            role,
            isActive
        });

        await newUser.save();

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createUser,
    getAllUsers
};