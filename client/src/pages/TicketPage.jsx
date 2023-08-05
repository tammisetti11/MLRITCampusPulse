import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Spinner, Badge } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTimesCircle, FaMapMarkerAlt } from "react-icons/fa";

export default function TicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const { data } = await api.get(`/tickets/${ticketId}`);
        setTicket(data);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [ticketId]);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your ticket...</p>
      </div>
    );

  if (!ticket)
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">Ticket not found.</h4>
        <Link to="/events" className="btn btn-outline-primary mt-3">
          Go Back to Events
        </Link>
      </div>
    );

  const event = ticket.eventId;
  const user = ticket.userId;

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge bg="success"><FaCheckCircle className="me-1" /> Paid</Badge>;
      case "pending":
        return <Badge bg="warning" text="dark"><FaClock className="me-1" /> Pending</Badge>;
      default:
        return <Badge bg="secondary"><FaTimesCircle className="me-1" /> Unknown</Badge>;
    }
  };

  const formatDateTime = (date, time) => {
    const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
    const datePart = new Date(date).toLocaleDateString(undefined, options);
    return `${datePart} at ${time}`;
  };

  const checkInTime = () => {
    const [hour, minPart] = event.time.split(":");
    const [minute] = minPart.split(" ");
    const eventDate = new Date(event.startDate);
    eventDate.setHours(parseInt(hour) - 0, parseInt(minute) - 30);
    return eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container my-5">
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt="Event Banner"
            className="w-100"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}
        <div className="card-body p-4">
          <h3 className="fw-bold text-primary mb-2">{event.title}</h3>
          <p className="text-muted mb-2">
            <FaMapMarkerAlt className="me-2" />
            {event.location}
          </p>

          <div className="mb-3">
            <strong>Event Date & Time:</strong><br />
            <span className="text-muted">{formatDateTime(event.startDate, event.time)}</span>
          </div>

          <div className="mb-3">
            <strong>Check-in Time:</strong><br />
            <span className="text-muted">{checkInTime()} </span>
          </div>

          <div className="mb-3">
            <strong>Ticket Code:</strong><br />
            <code>{ticket.uniqueCode}</code>
          </div>

          <div className="mb-3">
            <strong>Payment Status:</strong><br />
            {getStatusBadge(ticket.paymentStatus)}
          </div>

          <div className="mb-3">
            <strong>Registered On:</strong><br />
            <span className="text-muted">{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>

          <hr />

          <h5 className="fw-semibold mb-2">👤 Student Info</h5>
          <p className="mb-1">
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Roll Number:</strong> {user?.rollNumber || "N/A"}
          </p>

          <Link to="/my-tickets" className="btn btn-outline-primary mt-4">
            Back to My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
