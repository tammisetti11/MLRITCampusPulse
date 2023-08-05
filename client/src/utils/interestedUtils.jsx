// client/src/utils/interestedUtils.js

const STORAGE_KEY = "campuspulse_interested";

export const getInterested = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addInterested = (event) => {
    const interested = getInterested();
    if (!interested.find(e => e._id === event._id)) {
        interested.push(event);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(interested));
    }
};

export const removeInterested = (eventId) => {
    const interested = getInterested().filter(e => e._id !== eventId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interested));
};

export const isInterested = (eventId) => {
    return getInterested().some(e => e._id === eventId);
};