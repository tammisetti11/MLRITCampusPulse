import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function PaymentPage() {
    const { id } = useParams(); // This will get event ID from the URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load.");
            return;
        }

        const { data: order } = await api.post('/payment/create-order', {
            amount: event.price,
        });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "CampusPulse",
            description: `Pass for ${event.title}`,
            order_id: order.id,
            handler: async (response) => {
                alert("Payment successful!");
                // Optionally call API to generate pass
            },
            prefill: {
                name: "Your Name",
                email: "email@example.com",
            },
            theme: {
                color: "#f37254",
            },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    };

    if (loading) {
        return <div className="text-center mt-5">Loading event details...</div>;
    }

    if (!event) {
        return <div className="text-center mt-5 text-danger">Event not found.</div>;
    }

    return (
        <div className="text-center mt-5">
            <h3>Proceed to Payment</h3>
            <p className="text-muted">Event: {event.title}</p>
            <button className="btn btn-primary mt-3" onClick={handlePayment}>
                Pay ₹{event.price}
            </button>
        </div>
    );
}
