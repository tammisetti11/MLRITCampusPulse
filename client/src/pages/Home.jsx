// client/src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import EventCard from "../components/EventCard";
import api from "../api/axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../index.css";
import Footer from "../components/Footer";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    price: "All",
    category: "all",
    organizer: "all",
  });

  const [error, setError] = useState(null);

  // Get all unique categories and organizers
  const categories = ["All Event Types", ...new Set(events.map(e => e.category))];
  const organizers = ["All Organisers", ...new Set(events.map(e => e.organizer))];

  // Fetch events by tab
  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/events/${activeTab}`)
      .then(({ data }) => setEvents(data))
      .catch(err => {
        console.error(err);
        setError("Failed to load events.");
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Filter & Search
  let filteredEvents = events;

  // Search
  if (search.trim() !== "") {
    const q = search.toLowerCase();
    filteredEvents = filteredEvents.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  }

  // Price filter
  if (filters.price === "free") {
    filteredEvents = filteredEvents.filter(e => e.price === 0);
  } else if (filters.price === "paid") {
    filteredEvents = filteredEvents.filter(e => e.price > 0);
  }

  // Category filter
  if (filters.category !== "all") {
    filteredEvents = filteredEvents.filter(e => e.category === filters.category);
  }

  // Organizer filter
  if (filters.organizer !== "all") {
    filteredEvents = filteredEvents.filter(e => e.organizer === filters.organizer);
  }

  // Sort by date ascending
  filteredEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <>
      <HeroCarousel events={events} />
      <br />

      <div className="container my-10">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Events</h2>
          <div className="d-flex align-items-center gap-3">
            {/* Search */}
            <div
              className="input-group border rounded-pill overflow-hidden"
              style={{ maxWidth: "600px", background: "#f9f9f9" }}
            >
              <span
                className="input-group-text border-0"
                style={{ background: "#f9f9f9", color: "#FF6B00" }}
              >
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "#f9f9f9" }}
              />
            </div>

            {/* Filter */}
            <button
              className="btn p-0"
              data-bs-toggle="offcanvas"
              data-bs-target="#filterCanvas"
              aria-label="Filter events"
              style={{ color: "#FF6B00" }}
            >
              <i className="bi bi-funnel-fill fs-4"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="event-tabs mb-4">
          <button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={activeTab === "ongoing" ? "active" : ""}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <p>Loading {activeTab} events…</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <p>No {activeTab} events match your criteria.</p>
        ) : (
          <div className="row g-4">
            {filteredEvents.map((ev) => (
              <div key={ev._id} className="col-6 col-md-4 col-lg-3">
                <EventCard event={ev} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offcanvas Filter */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="filterCanvas"
        aria-labelledby="filterCanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 id="filterCanvasLabel">Filter results</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <h6 className="mb-2 fw-bold">Price</h6>
          {["All","Free", "Paid"].map((p) => (
            <div className="form-check mb-2" key={p}>
              <input
                className="form-check-input"
                type="radio"
                name="price"
                checked={filters.price === p}
                onChange={() => setFilters({ ...filters, price: p })}
              />
              <label className="form-check-label text-capitalize">{p}</label>
            </div>
          ))}

          <hr />

          <h6 className="mb-2 fw-bold">Category</h6>
          <select
            className="form-select mb-3"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <h6 className="mb-2 fw-bold">Organizer</h6>
          <select
            className="form-select mb-3"
            value={filters.organizer}
            onChange={(e) => setFilters({ ...filters, organizer: e.target.value })}
          >
            {organizers.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() =>
              setFilters({ price: "all", category: "all", organizer: "all" })
            }
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
