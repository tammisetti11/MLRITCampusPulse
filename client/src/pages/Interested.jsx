// client/src/pages/Interested.jsx

import React, { useEffect, useState } from "react";
import { getInterested } from "../utils/InterestedUtils";
import EventCard from "../components/EventCard";

export default function Interested() {
    const [interestedEvents, setInterestedEvents] = useState([]);

    useEffect(() => {
        setInterestedEvents(getInterested());
    }, []);

    const handleUninterested = (eventId) => {
        setInterestedEvents(prev => prev.filter(e => e._id !== eventId));
    };

    return (
        <div className="container my-5">
            <h3 className="mb-4">Interested Events</h3>
            {interestedEvents.length === 0 ? (
                <p>You have not marked any events as interested yet.</p>
            ) : (
                <div className="row g-3">
                    {interestedEvents.map(event => (
                        <div key={event._id} className="col-6 col-md-4 col-lg-3">
                            <EventCard
                                event={event}
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
