const User = require('../models/User');
const Event = require('../models/Event');

exports.addInterested = async (req, res) => {
    const user = await User.findById(req.user._id);
    const { eventId } = req.params;
    console.log("User before adding:", user);
    console.log("Event ID:", eventId);
    if (!user.interestedEvents.includes(eventId)) {
        user.interestedEvents.push(eventId);
        await user.save();
    }

    res.status(200).json({ message: 'Event marked as interested' });
};

exports.removeInterested = async (req, res) => {
    const user = await User.findById(req.user._id);
    const { eventId } = req.params;

    user.interestedEvents = user.interestedEvents.filter(id => id.toString() !== eventId);
    await user.save();

    res.status(200).json({ message: 'Event removed from interested' });
};

exports.getInterested = async (req, res) => {
    const user = await User.findById(req.user._id).populate('interestedEvents');
    res.status(200).json(user.interestedEvents);
};
