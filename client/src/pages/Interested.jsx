import React, { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import { useUser } from "../context/UserContext";

export default function Interested() {
    const { user } = useUser();
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchInterestedEvents() {
            if (!user) return;

            try {
                const { data } = await api.get("/users/interested");
                setInterestedEvents(data || []);
            } catch (err) {
                console.error("Failed to fetch interested events:", err);
                setError("Failed to load interested events.");
            } finally {
                setLoading(false);
            }
        }

        fetchInterestedEvents();
    }, [user]);

    const handleUninterested = async (eventId) => {
        try {
            await api.delete(`/users/interested/${eventId}`); // Optional: backend route to remove interest
            setInterestedEvents(prev => prev.filter(e => e._id !== eventId));
        } catch (err) {
            console.error("Failed to remove interested event:", err);
        }
    };

    return (
        <div className="container my-5">
            <h3 className="mb-4">Interested Events</h3>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : interestedEvents.length === 0 ? (
                <p>You have not marked any events as interested yet.</p>
            ) : (
                <div className="row g-3">
                    {interestedEvents.map(event => (
                        <div key={event._id} className="col-6 col-md-4 col-lg-3">
                                <EventCard
                                    event={event}
                                    defaultInterested={true}
                                    onUninterested={handleUninterested}
                                    small={true}
                                />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
