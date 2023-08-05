// client/src/components/EventCard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addInterested, removeInterested, isInterested } from "../utils/InterestedUtils";
import { useUser } from "../context/UserContext";
export default function EventCard({ event, onUninterested, small = false }) {
    const { user } = useUser();
    const navigate = useNavigate();
    const [interested, setInterested] = useState(isInterested(event._id));

    const toggleInterest = (e) => {
        e.stopPropagation();
        if (interested) {
            removeInterested(event._id);
            setInterested(false);
            if (onUninterested) {
                setTimeout(() => {
                    onUninterested(event._id);
                }, 2000); // remove after 2 seconds
            }
        } else {
            addInterested(event);
            setInterested(true);
        }
    };

    return (
        <div
            className="card shadow-sm position-relative h-100"
            style={{
                cursor: "pointer",
                overflow: "hidden",
                maxWidth: small ? "300px" : "100%",
                margin: small ? "0 auto" : ""
            }}
            onClick={() => navigate(`/events/${event._id}`)}
        >
            {user?.role === "admin" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/edit-event/${event._id}`);
                    }}
                    className="btn btn-sm my-custom-button position-absolute"
                    style={{
                        top: "10px",
                        left: "10px",
                        background: "rgba(255,255,255,0.8)",
                        borderRadius: "50%",
                        zIndex: 10
                    }}
                    aria-label="Edit event"
                >
                    <i className="bi bi-pencil-fill text-black"></i>
                </button>
            )}
            {/* Heart Icon */}
            <button
                onClick={toggleInterest}
                className="btn btn-sm position-absolute"
                style={{
                    top: "10px",
                    right: "10px",
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "50%",
                    zIndex: 10
                }}
                aria-label="Mark as interested"
            >
                <i className={`bi ${interested ? "bi-heart-fill text-danger" : "bi-heart text-secondary"}`}></i>
            </button>

            {/* Image */}
            {event.image && (
                <img
                    src={event.image}
                    alt={event.title}
                    className="card-img-top"
                    style={{
                        width: "100%",
                        height: small ? "150px" : "200px",
                        objectFit: "cover"
                    }}
                />
            )}

            {/* Card Body */}
            <div className="card-body p-2">
                <h6 className="fw-bold mb-1">{event.title}</h6>
                <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}>
                    <i className="bi bi-calendar-event-fill me-1"></i>
                    {new Date(event.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} - {new Date(event.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="card-text text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {event.location}
                </p>
            </div>
        </div>
    );
}
