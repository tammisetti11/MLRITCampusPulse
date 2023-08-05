const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Event = require("../models/Event");

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

exports.getInterestedEvents = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate("interestedEvents");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user.interestedEvents);
    } catch (error) {
      console.error("Error fetching interested events:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Add an event to user's interested list
  exports.addInterestedEvent = async (req, res) => {
    const { eventId } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
      console.log(eventId)
      if (!user.interestedEvents.includes(eventId)) {
        user.interestedEvents.push(eventId);
        await user.save();
      }
  
      res.status(200).json({ message: "Event marked as interested" });
    } catch (error) {
      console.error("Error adding interested event:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Remove an event from user's interested list
  exports.removeInterestedEvent = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { interestedEvents: eventId } },
        { new: true }
      );
  
      res.status(200).json({ message: "Event removed from interested list" });
    } catch (error) {
      console.error("Error removing interested event:", error);
      res.status(500).json({ message: "Server error" });
    }
  };