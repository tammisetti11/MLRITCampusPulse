// client/src/pages/EventDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useUser } from "../context/UserContext";
import { Modal, Button, Form, Alert } from "react-bootstrap";
// Note: Bootstrap Badge is not explicitly imported as you're using custom span for badges

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        phone: "",
        studentId: ""
    });

    useEffect(() => {
        async function fetchEvent() {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        email: user.email || ""
                    }));
                }
            } catch (err) {
                console.error("Error fetching event:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id, user]);

    const handleRegisterClick = () => {
        if (!user) {
            navigate("/login");
        } else {
            setShowModal(true);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
        } catch (err) {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link. Please try again or copy manually.');
        }
    };
    const handlePayment = async () => {
        setShowModal(false);

        if (event.price <= 0) {
            try {
                const { data } = await api.post(
                    `/tickets`,
                    { eventId: event._id }, // Send plain JSON
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`, // if auth is required
                            'Content-Type': 'application/json'
                        }
                    }
                );

                alert("Successfully registered! Your ticket has been generated.");
                console.log("Ticket ID:", data.ticket._id);
                navigate(`/tickets/${data.ticket._id}`);
            } catch (error) {
                console.error("Error generating free ticket:", error);
                alert(error.response?.data?.message || "Failed to generate ticket.");
            }
        } else {
            navigate(`/events/${event._id}/payment`);
        }
    };



    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getGoogleCalendarLink = (event) => {
        console.log("startDate:", event.startDate, "endDate:", event.endDate);
        const formatDate = (date) => {
            const d = new Date(date);
            if (isNaN(d)) return ""; // Prevent invalid date error
            return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        const start = formatDate(event.startDate);
        const end = formatDate(event.endDate);

        if (!start || !end) {
            console.warn("Invalid start or end date for event:", event);
            return "#"; // fallback or skip rendering
        }

        const details = {
            text: event.title || "Event",
            dates: `${start}/${end}`,
            details: event.description || "",
            location: event.location || "",
        };

        const params = new URLSearchParams(details);
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
    };



    // Corrected Google Maps link
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading event details...</span>
                </div>
                <p className="ms-2 text-muted">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="alert alert-warning shadow" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> Event not found. It might have been moved or deleted.
                </div>
            </div>
        );
    }

    // No new dummy data variables introduced as per your instruction.
    // The existing event properties will be used directly or default to "N/A" / "Not Provided".

    return (
        <div>
            {/* Hero Section with blurred background and card */}
            <div
                className="position-relative d-flex justify-content-center align-items-center py-4 px-3 min-vh-50" // Reduced py-5 to py-4
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${event.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'contrast(1.1) brightness(0.9)',
                }}
            >
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        backdropFilter: 'blur(10px) brightness(0.6)',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        zIndex: 1,
                    }}
                ></div>

                <div
                    className="card d-flex flex-column flex-lg-row shadow-lg rounded-4 overflow-hidden"
                    style={{
                        maxWidth: '960px', // Slightly reduced max-width from 1000px
                        width: '95%',
                        zIndex: 2,
                        backgroundColor: 'white',
                    }}
                >
                    <div className="card-body p-4 p-md-4 d-flex flex-column justify-content-between" style={{ flex: 1.5 }}> {/* Reduced p-md-5 to p-md-4 */}
                        <div>
                            {/* Event Title */}
                            <h1 className="fw-bold display-6 mb-2 text-dark">
                                {event.title}
                            </h1>
                            <br></br>
                            {/* Event Date & Time */}
                            <div className="d-flex align-items-center flex-wrap fs-5 fw-semibold mb-3">
                                <div className="me-4 d-flex align-items-center">
                                    <i className="bi bi-calendar-event-fill me-2 fs-5"></i>
                                    <span>
                                        {formatDate(event.startDate)}
                                        {event.numDates && event.numDates > 1 && (
                                            <span className="ms-1">+ {event.numDates - 1} dates</span>
                                        )}
                                    </span>
                                </div>
                                {event.startTime && (
                                    <div className="d-flex align-items-center text-success">
                                        <i className="bi bi-clock me-2 fs-5"></i>
                                        <span>{event.startTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row align-items-center mt-3 gap-2 w-100">
                            {/* Register Button */}
                            <Button
                                variant="primary"
                                className="rounded-pill fw-bold px-3 py-1"
                                onClick={handleRegisterClick}
                                style={{ backgroundColor: "#FF6B00", borderColor: "#FF6B00" }}
                            >
                                <i className="bi bi-ticket-perforated-fill me-2"></i> Register
                            </Button>

                            {/* Share Icon */}
                            <Button
                                variant="light"
                                className="rounded-pill px-2 py-1 d-flex align-items-center justify-content-center shadow-sm"
                                onClick={handleCopy}
                                title="Share Event Link"
                                style={{ backgroundColor: "#F0F0F0", border: "none" }}
                            >
                                <i className="bi bi-share-fill fs-5 text-dark"></i>
                            </Button>

                            {/* Copied Alert */}
                            {copied && (
                                <Alert variant="success" className="ms-sm-2 mb-0 py-1 px-2 d-flex align-items-center tiny-alert">
                                    <i className="bi bi-check-circle-fill me-1"></i> Link Copied!
                                </Alert>
                            )}

                            {/* Spacer to push calendar icon to right */}
                            <div className="ms-sm-auto d-none d-sm-block"></div>

                            {/* Add to Calendar Icon */}
                            <Button
                                variant="light"
                                className="rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
                                onClick={() => window.open(getGoogleCalendarLink(event), "_blank")}
                                title="Add to Calendar"
                                style={{
                                    backgroundColor: "#E8F0FE",
                                    border: "none",
                                    fontWeight: 500,
                                    color: "#1a73e8"
                                }}
                            >
                                <i className="bi bi-calendar-plus fs-5"></i>
                                <span style={{ fontSize: "0.95rem" }}>Add to Calendar</span>
                            </Button>


                        </div>

                    </div>
                    <div className="col-lg-5 p-0 d-flex align-items-stretch">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Sections (About & Details) */}
            <div className="container my-4 py-2"> {/* Reduced my-5 to my-4, py-3 to py-2 */}
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10">
                        {/* About This Event Section */}
                        <h3 className="text-uppercase fw-bold mb-3 text-center text-md-start text-dark fs-4">About This Event</h3> {/* Reduced mb-4 to mb-3, added fs-4 */}

                        <p className="text-secondary mb-3 pb-1" style={{ fontSize: "0.95rem" }}>{event.description}</p> {/* Reduced lead to no lead, added specific font-size, reduced mb-4 to mb-3, pb-2 to pb-1 */}
                        {/* START: Your provided "Event Details" section with enhanced styling */}
                        <h4 className="text-uppercase fw-bold mt-4 mb-3 border-top pt-3 text-dark fs-5">Event Details</h4> {/* Reduced mt-5 to mt-4, mb-4 to mb-3, pt-4 to pt-3, added fs-5 */}
                        <div className="p-4 bg-white rounded-3 shadow-sm border"> {/* Kept p-4 as it gives a good internal padding, you can reduce to p-3 if needed */}
                            <div className="row g-3"> {/* Reduced g-4 to g-3 */}
                                {/* Event Type */}
                                <div className="col-md-6">
                                    <p className="mb-1 fw-semibold text-uppercase text-muted small">Event Category</p> {/* Added small */}
                                    <div className="d-flex flex-wrap gap-2">
                                        {event.category ? (
                                            <span className="badge rounded-pill px-2 py-1 fw-normal" style={{ backgroundColor: "#FF6B00", color: "#fff", fontSize: "0.75rem" }}> {/* Reduced px-3 py-2, font-size */}
                                                {event.category.toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="text-muted small">N/A</span>
                                        )}
                                    </div>
                                </div>

                                {/* Organizer (Department in screenshot, but you prefer Organizer) */}
                                <div className="col-md-6 mt-3 pt-md-2">
                                    <p className="mb-1 fw-semibold text-uppercase text-muted small">Organizer</p> {/* Added small */}
                                    <p className="mb-0 text-dark fw-semibold small">{event.organizer || "TBA"}</p> {/* Added small */}
                                </div>


                                {/* Price */}
                                <div className="col-md-6 mt-3 pt-md-2">
                                    <p className="mb-1 fw-semibold text-uppercase text-muted small">Price</p> {/* Added small */}
                                    <p className="mb-0 text-dark fw-semibold small">{event.price > 0 ? `$${event.price}` : "Free"}</p> {/* Added small */}
                                </div>

                                {/* Capacity */}
                                <div className="col-md-6 mt-3 pt-md-2">
                                    <p className="mb-1 fw-semibold text-uppercase text-muted small">Capacity</p> {/* Added small */}
                                    <p className="mb-0 text-dark fw-semibold small">{event.capacity ? `${event.capacity} Attendees` : "Unlimited"}</p> {/* Added small */}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-4 border-top pt-3"> {/* Reduced mt-5 to mt-4, pt-4 to pt-3 */}
                                <h6 className="fw-bold text-muted text-uppercase mb-3 small">Contact Information</h6> {/* Added small */}
                                <div className="row g-2"> {/* Reduced g-3 to g-2 */}
                                    <div className="col-md-4">
                                        <p className="mb-1 fw-semibold text-dark small">Contact Name:</p> {/* Added small */}
                                        <p className="mb-0 text-secondary small">{event.contactName || "Not Provided"}</p> {/* Added small */}
                                    </div>
                                    <div className="col-md-4">
                                        <p className="mb-1 fw-semibold text-dark small">Email:</p> {/* Added small */}
                                        {event.contactEmail ? (
                                            <a href={`mailto:${event.contactEmail}`} className="text-decoration-none fw-semibold small" style={{ color: "#FF6B00" }}> {/* Added small */}
                                                {event.contactEmail}
                                            </a>
                                        ) : (
                                            <span className="text-muted small">Not Provided</span>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <p className="mb-1 fw-semibold text-dark small">Phone:</p> {/* Added small */}
                                        <p className="mb-0 text-secondary small">{event.contactPhone || "Not Provided"}</p> {/* Added small */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* END: Your provided "Event Details" section */}
                    </div>
                </div>
            </div>

            {/* Registration Modal (minor style tweaks) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#FF6B00", color: "#fff" }}>
                    <Modal.Title>
                        <h5 className="mb-0 text-white">Register for <span className="fw-bold">{event.title}</span></h5> {/* Reduced h4 to h5 */}
                        <div className="small text-white-75">{formatDate(event.startDate)}</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3"> {/* Reduced p-4 to p-3 */}
                    <p className="text-muted mb-3 small">Please fill out your details to proceed with registration.</p> {/* Reduced mb-4 to mb-3, added small */}
                    <Form>
                        <div className="row g-2"> {/* Reduced g-3 to g-2 */}
                            <Form.Group className="col-md-6 mb-2"> {/* Added mb-2 */}
                                <Form.Label className="fw-semibold small">First Name <span className="text-danger">*</span></Form.Label> {/* Added small */}
                                <Form.Control
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="Enter your first name"
                                    size="sm" // Added sm size for smaller input
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-2"> {/* Added mb-2 */}
                                <Form.Label className="fw-semibold small">Last Name <span className="text-danger">*</span></Form.Label> {/* Added small */}
                                <Form.Control
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Enter your last name"
                                    size="sm" // Added sm size for smaller input
                                    required
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-2 mt-2"> {/* Reduced mb-3 mt-3 to mb-2 mt-2 */}
                            <Form.Label className="fw-semibold small">Email <span className="text-danger">*</span></Form.Label> {/* Added small */}
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                size="sm" // Added sm size for smaller input
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2"> {/* Reduced mb-3 to mb-2 */}
                            <Form.Label className="fw-semibold small">Phone Number</Form.Label> {/* Added small */}
                            <Form.Control
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g., 123-456-7890"
                                size="sm" // Added sm size for smaller input
                            />
                        </Form.Group>
                        <Form.Group className="mb-3"> {/* Reduced mb-4 to mb-3 */}
                            <Form.Label className="fw-semibold small">Student ID (Optional)</Form.Label> {/* Added small */}
                            <Form.Control
                                type="text"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                placeholder="Enter your Student ID"
                                size="sm" // Added sm size for smaller input
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="py-2"> {/* Reduced default padding */}
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="px-3 py-1">Cancel</Button> {/* Reduced px-4 py-2 */}
                    <Button
                        variant="success"
                        onClick={handlePayment}
                        className="px-3 py-1"
                        style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                    >
                        Proceed to Payment ({event.price > 0 ? `$${event.price}` : "Free"})
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}