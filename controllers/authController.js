const User = require('../model/User');

const signup = async (req, res) => {
    const { username, email, password, name } = req.body;
    const newUser = new User({
        email: email,
        username: username,
        name: name,
    });
    try {
        console.log("started");
        const registeredUser = await User.register(newUser, password);
        console.log("ended");
        res.send(registeredUser);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login =  (req, res) => {
    res.send({ message: 'Login successful!', user: req.user });
};

module.exports = { signup, login };
