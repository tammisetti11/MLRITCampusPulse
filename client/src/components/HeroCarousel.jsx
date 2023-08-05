// client/src/components/HeroCarousel.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CAROUSEL_HEIGHT = 420; // change this to adjust height

export default function HeroCarousel({ events }) {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter(e => new Date(e.startDate) > now)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 2);
    }, [events]);

    // Auto-advance
    useEffect(() => {
        if (upcomingEvents.length < 2) {
            setIndex(0);
            return;
        }
        const id = setInterval(() => {
            setIndex(prev => (prev + 1) % upcomingEvents.length);
        }, 7000);
        return () => clearInterval(id);
    }, [upcomingEvents.length]);

    if (!upcomingEvents.length) return null;

    return (
        <div className="container mb-4">
            <div
                className="hero-carousel-wrapper rounded-4 shadow-sm position-relative overflow-hidden"
                style={{ height: CAROUSEL_HEIGHT }}
            >
                <Carousel
                    activeIndex={index}
                    onSelect={i => setIndex(i)}
                    fade
                    controls={upcomingEvents.length > 1}
                    indicators={upcomingEvents.length > 1}
                    pause="hover"
                    className="h-100"
                >
                    {upcomingEvents.map(ev => (
                        <Carousel.Item
                            key={ev._id}
                            className="h-100"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/events/${ev._id}`)}
                        >
                            <div className="position-relative h-100 w-100">
                                <img
                                    src={ev.image}
                                    alt={ev.title}
                                    className="w-100"
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        display: "block",
                                        aspectRatio: "3 / 1" // forces wide layout like Eventbrite
                                    }}
                                />

                                {/* Gradient overlay */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 80%)"
                                    }}
                                />
                            </div>
                            <Carousel.Caption
                                className="text-start"
                                style={{ maxWidth: "60%", bottom: "2.2rem" }}
                            >
                                <h2 className="fw-bold mb-2" style={{ fontSize: "2.2rem" }}>
                                    {ev.title}
                                </h2>
                                
                                <button
                                    className="btn btn-sm px-3 py-2"
                                    style={{
                                        backgroundColor: "#FF6B00",
                                        border: "none",
                                        fontWeight: 600,
                                        letterSpacing: ".5px"
                                    }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        navigate(`/events/${ev._id}`);
                                    }}
                                >
                                    View Details
                                </button>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
