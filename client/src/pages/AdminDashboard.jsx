import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useUser } from "../context/UserContext";

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button onClick={() => navigate("/admin/create-event")} className="btn btn-primary">
          Create New Event
        </button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Dates</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>
                    <img src={event.image} alt={event.title} width="100" height="60" style={{objectFit: "cover"}} />
                  </td>
                  <td>{event.title}</td>
                  <td>
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </td>
                  <td>{event.location}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
