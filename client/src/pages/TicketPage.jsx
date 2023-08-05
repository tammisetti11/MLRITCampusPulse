// src/pages/TicketPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

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

    if (loading) return <div>Loading ticket...</div>;
    console.log("Ticket data:", ticket);
    if (!ticket) return <div>Ticket not found.</div>;

    return (
        <div className="container my-5">
            <h2>Your Event Ticket</h2>
            <hr />
            <p><strong>Event:</strong> {ticket.eventId?.title || "Event"}</p>
            <p><strong>Ticket Code:</strong> {ticket.uniqueCode}</p>
            <p><strong>Status:</strong> {ticket.paymentStatus}</p>
            <p><strong>Registered On:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
    );
}
