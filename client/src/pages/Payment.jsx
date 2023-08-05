// client/src/pages/Payment.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { event, formData } = location.state || {};

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!event || !formData) {
            navigate("/"); // redirect home if accessed directly
        }
    }, [event, formData, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // simulate payment
            alert("Payment successful! Registration confirmed.");

            // Optionally, post registration to your backend here:
            await api.post("/registrations", {
                eventId: event._id,
                ...formData,
                paymentStatus: "Paid"
            });

            navigate("/pass", { state: { event, formData } }); // redirect to pass/confirmation
        } catch (error) {
            console.error(error);
            alert("Payment failed, please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!event || !formData) return null;

    return (
        <div className="container my-5">
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
                <h3 className="mb-3">Payment for {event.title}</h3>
                <p>
                    <i className="bi bi-calendar-event-fill me-2"></i>
                    {new Date(event.startDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p><strong>Price:</strong> {event.price > 0 ? `$${event.price}` : "Free"}</p>
                <hr />
                <h5>Review Your Details</h5>
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Student ID:</strong> {formData.studentId}</p>
                <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? "Processing..." : `Pay ${event.price > 0 ? `$${event.price}` : "Now"}`}
                </button>
            </div>
        </div>
    );
}
