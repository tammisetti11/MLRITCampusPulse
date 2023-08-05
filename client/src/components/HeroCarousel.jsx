// client/src/components/HeroCarousel.jsx

import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function HeroCarousel({ events }) {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % events.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [events.length]);

    return (
        <div className="container-fluid p-0" style={{ maxHeight: "400px", overflow: "hidden" }}>
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                fade
                controls={true}          // enables next/prev buttons
                indicators={true}        // enables dots for manual selection
                pause="hover"            // pause auto-slide on hover for usability
            >
                {events.map(event => (
                    <Carousel.Item
                        key={event._id}
                        onClick={() => navigate(`/events/${event._id}`)}
                        style={{ cursor: "pointer" }}
                    >
                        <img
                            src={event.image}
                            className="d-block w-100"
                            alt={event.title}
                            style={{
                                objectFit: "cover",
                                height: "400px",
                                filter: "brightness(0.7)"
                            }}
                        />
                        <Carousel.Caption>
                            <h2 className="fw-bold">{event.title}</h2>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}
