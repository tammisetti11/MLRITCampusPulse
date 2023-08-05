import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useUser } from "../context/UserContext";
import { Spinner, Alert, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";

export default function MyTickets() {
    const { user } = useUser();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTickets() {
            try {
                const { data } = await api.get("/tickets/my", {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                setTickets(data);
            } catch (err) {
                console.error("Error fetching tickets:", err);
                setError("Failed to load your tickets.");
            } finally {
                setLoading(false);
            }
        }

        if (user) fetchTickets();
    }, [user]);

    if (!user)
        return (
            <div className="container py-5 text-center">
                <Alert variant="warning">Please log in to view your tickets.</Alert>
            </div>
        );

    if (loading)
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" /> <p className="mt-2">Loading your tickets...</p>
            </div>
        );

    if (error)
        return (
            <div className="container py-5">
                <Alert variant="danger" className="text-center">{error}</Alert>
            </div>
        );

    if (tickets.length === 0)
        return (
            <div className="container py-5 text-center">
                <p className="text-muted fs-5">You haven’t registered for any events yet.</p>
                <Link to="/events" className="btn btn-primary mt-3">Explore Events</Link>
            </div>
        );

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center text-primary">
                <FaTicketAlt className="me-2" /> My Tickets
            </h2>
            <div className="row g-4">
                {tickets.map((ticket) => {
                    const event = ticket.eventId;
                    const bgImage = event?.image || "/default-event.jpg";

                    return (
                        <div key={ticket._id} className="col-md-6 col-lg-4">
                            <div
                                className="ticket-card shadow-sm rounded overflow-hidden position-relative text-white"
                                style={{
                                    backgroundImage: `url(${bgImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "300px",
                                    borderRadius: "16px",
                                }}
                            >
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100"
                                    style={{
                                        background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <h5 className="fw-bold">{event?.title || "Event"}</h5>
                                        <div className="small text-light-emphasis mb-1">
                                            Ticket Code: <span className="fw-semibold">{ticket.uniqueCode}</span>
                                        </div>
                                        <div className="small">
                                            Date Issued: {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end">
                                        <Badge
                                            bg={
                                                ticket.paymentStatus === "paid"
                                                    ? "success"
                                                    : ticket.paymentStatus === "pending"
                                                    ? "warning"
                                                    : "secondary"
                                            }
                                            className="text-uppercase"
                                        >
                                            {ticket.paymentStatus}
                                        </Badge>
                                        <Link
                                            to={`/tickets/${ticket._id}`}
                                            className="btn btn-sm btn-light fw-semibold"
                                        >
                                            View Ticket
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
