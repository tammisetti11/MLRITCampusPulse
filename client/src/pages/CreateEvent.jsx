import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useUser } from "../context/UserContext";

export default function CreateEvent() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        organizer: user?.username || "",
        startDate: "",
        endDate: "",
        location: "",
        price: "",
        capacity: "",
        time: "",
    });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setImageFile(file);
            setPreviewImage(file ? URL.createObjectURL(file) : null);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { title, description, category, organizer, startDate, endDate, location, price, capacity, time } = formData;
        if (!title || !description || !category || !organizer || !startDate || !endDate || !location || !time) {
            setError("Please fill in all required fields.");
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            setError("End date cannot be before start date.");
            return;
        }
        const priceNum = price === "" ? 0 : Number(price);
        const capacityNum = capacity === "" ? 0 : Number(capacity);
        if (isNaN(priceNum) || isNaN(capacityNum) || priceNum < 0 || capacityNum < 0) {
            setError("Price and capacity must be valid non-negative numbers.");
            return;
        }

        const data = new FormData();
        data.append("title", title);
        data.append("description", description);
        data.append("category", category);
        data.append("organizer", organizer);
        data.append("startDate", startDate);
        data.append("endDate", endDate);
        data.append("location", location);
        data.append("price", priceNum);
        data.append("capacity", capacityNum);
        data.append("time", time);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            await api.post("/events", data);
            setSuccessMessage("🎉 Event created successfully!");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error(err);
            setError("Failed to create event.");
        }
    };

    if (!user || user.role !== "admin") return null;

    return (
        <div className="container my-5">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                <h2 className="text-center fw-bold mb-4" style={{ color: "#FF6B00" }}>
                    Create New Event
                </h2>
                {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div>
                                <label className="form-label text-muted">Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control rounded-pill" />
                            </div>
                            <div>
                                <label className="form-label text-muted mt-3">Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-control rounded" rows="4"></textarea>
                            </div>
                            <div>
                                <label className="form-label text-muted mt-3">Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="form-select rounded-pill">
                                    <option value="">Select Category</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Music">Music</option>
                                    <option value="Arts">Arts & Culture</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Education">Education</option>
                                    <option value="Food">Food & Drink</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label text-muted mt-3">Organizer *</label>
                                <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} className="form-control rounded-pill" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex gap-3">
                                <div className="flex-fill">
                                    <label className="form-label text-muted">Start Date *</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control rounded-pill" />
                                </div>
                                <div className="flex-fill">
                                    <label className="form-label text-muted">End Date *</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control rounded-pill" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label text-muted mt-3">Event Time *</label>
                                <input type="time" name="time" value={formData.time} onChange={handleChange} className="form-control rounded-pill" />
                            </div>
                            <div>
                                <label className="form-label text-muted mt-3">Location *</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control rounded-pill" />
                            </div>
                            <div className="d-flex gap-3 mt-3">
                                <div className="flex-fill">
                                    <label className="form-label text-muted">Price</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control rounded-pill" min="0" />
                                </div>
                                <div className="flex-fill">
                                    <label className="form-label text-muted">Capacity</label>
                                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-control rounded-pill" min="0" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="form-label text-muted">Event Image</label>
                                <input type="file" className="form-control rounded-pill" name="image" accept="image/*" onChange={handleChange} />
                                {previewImage && (
                                    <div className="mt-2 text-center">
                                        <img src={previewImage} alt="Event Preview" className="img-fluid rounded shadow" style={{ maxHeight: "250px", objectFit: "cover" }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-success rounded-pill px-4">
                            <i className="bi bi-calendar-plus me-2"></i> Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
