import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function EventCard({
  event,
  onUninterested,
  small = false,
  defaultInterested = false,
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [interested, setInterested] = useState(defaultInterested || false);

  const toggleInterest = async (e) => {
    e.stopPropagation();

    try {
      if (interested) {
        await api.delete(`/users/interested/${event._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setInterested(false);
        if (onUninterested) {
          setTimeout(() => {
            onUninterested(event._id);
          }, 2000);
        }
      } else {
        await api.post(`/users/interested/${event._id}`);
        setInterested(true);
      }
    } catch (error) {
      console.error("Error toggling interest:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const getDaysLeft = (startDate) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const diff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div
      className="card eventbrite-card border-0 position-relative"
      onClick={() => navigate(`/events/${event._id}`)}
      style={{
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
        maxWidth: "320px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
    >
      {/* Action Icons - hover-only */}
      <div className="event-card-icons position-absolute top-0 start-0 w-100 px-2 pt-2 d-flex justify-content-between" style={{ pointerEvents: "none" }}>
        {/* Admin Edit Icon */}
        {user?.role === "admin" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/edit-event/${event._id}`);
            }}
            className="btn btn-sm"
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              pointerEvents: "auto"
            }}
            aria-label="Edit event"
          >
            <i className="bi bi-pencil-fill text-dark"></i>
          </button>
        )}

        {/* Share + Heart */}
        <div className="d-flex gap-1" style={{ pointerEvents: "auto" }}>
          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`${window.location.origin}/events/${event._id}`);
              alert("Link copied!");
            }}
            className="btn btn-sm"
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%"
            }}
            aria-label="Copy event link"
          >
            <i className="bi bi-share-fill text-dark"></i>
          </button>

          {/* Heart Button */}
          <button
            onClick={toggleInterest}
            className="btn btn-sm"
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%"
            }}
            aria-label="Toggle interest"
          >
            <i className={`bi ${interested ? "bi-heart-fill text-danger" : "bi-heart text-secondary"}`}></i>
          </button>
        </div>
      </div>

      {/* Image */}
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-100"
          style={{
            height: small ? "160px" : "180px",
            objectFit: "cover"
          }}
        />
      )}

      {/* Card Body */}
      <div className="p-3">
        <h6 className="fw-semibold mb-1">{event.title}</h6>
        <p className="mb-1 fw-medium text-muted" style={{ fontSize: "0.75rem" }}>
          <i className="bi bi-calendar-event me-1"></i>
          {new Date(event.startDate).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric"
          })}{" "}
          -{" "}
          {new Date(event.endDate).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric"
          })}
        </p>

        <p className="text-muted mb-2" style={{ fontSize: "0.65rem" }}>
          <i className="bi bi-geo-alt-fill me-1"></i>
          {event.location}
        </p>

        <span
          className="badge bg-light border text-dark"
          style={{ fontSize: "0.75rem" }}
        >
          {event.price === 0 ? "Free" : `₹${event.price}`}
        </span>
      </div>
    </div>
  );
}
