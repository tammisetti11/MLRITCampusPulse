const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Please provide both current and new passwords." });
    }

    try {
        const user = await User.findById(userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating password." });
    }
};
