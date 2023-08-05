// client/src/components/Header.jsx

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// Import Material UI Icons
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'; // For tickets
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'; // For Create an Event

import UserContext from "../context/UserContext";
import logo from "../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css"; // Keep for bi-person-circle and bi-chevron-down
import "../index.css";

export default function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext);

    return (
        <nav className="navbar navbar-expand-lg bg-white shadow navbar-custom">
            <div className="container position-relative">

                {/* LEFT: MLRIT Logo */}
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="MLRIT" style={{ height: "55px" }} />
                </Link>

                {/* CENTER: CampusPulse */}
                <Link
                    to="/"
                    className="navbar-brand"
                    style={{
                        fontFamily: "'Poppins', ",
                        fontWeight: 600,
                        fontSize: "1.8rem",
                        letterSpacing: "0.5px",
                        textDecoration: "none"
                    }}
                >
                    <span style={{ color: "#222831" }}>Campus</span>
                    <span style={{ color: "#FF6B00", fontWeight: 700 }}>Pulse</span>
                </Link>

                {/* RIGHT: New Icons & Account with Dropdown */}
                <div className="d-flex align-items-center ms-auto">
                    {user?.role === "admin" && (
                        <Link to="/admin/create-event" className="btn btn-sm my-custom-button me-2 d-flex align-items-center gap-1">
                            <i className="bi bi-plus-lg"></i> Create
                        </Link>
                    )}
                    {/* Likes */}
                    <Link
                        to="/interested"
                        className="icon-link d-flex flex-column align-items-center mx-3 text-decoration-none"
                        style={{ fontSize: "0.75rem" }}
                    >
                        <FavoriteBorderOutlinedIcon fontSize="small" />
                        <span style={{ marginTop: "1px" }}>Likes</span>
                    </Link>

                    {/* My Tickets */}
                    <Link
                        to="/my-tickets"
                        className="icon-link d-flex flex-column align-items-center mx-3 text-decoration-none"
                        style={{ fontSize: "0.75rem" }}
                    >
                        <ConfirmationNumberOutlinedIcon fontSize="small" />
                        <span style={{ marginTop: "1px" }}>Tickets</span>
                    </Link>



                    {/* Account with Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn btn-light d-flex align-items-center gap-2"
                            id="profileMenu"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ paddingLeft: '8px', paddingRight: '8px' }}
                        >
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    className="rounded-circle"
                                    style={{ height: "36px", width: "36px" }}
                                />
                            ) : (
                                <i className="bi bi-person-circle fs-4"></i>
                            )}
                            {user && (
                                <span className="fw-medium d-none d-md-inline">{user.name}</span>
                            )}
                            <i className="bi bi-chevron-down ms-1"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end mt-3" aria-labelledby="profileMenu" style={{ minWidth: "200px" }}>
                            {user ? (
                                <>
                                    {/* You can choose to use Material UI icons here as well for consistency */}
                                    <li><Link className="dropdown-item" to="/notifications"><NotificationsOutlinedIcon className="me-2" />Notifications</Link></li>
                                    <li><Link className="dropdown-item" to="/interested"><FavoriteBorderOutlinedIcon className="me-2" />Liked Events</Link></li>
                                    <li><Link className="dropdown-item" to="/my-tickets"><ConfirmationNumberOutlinedIcon className="me-2" />My Tickets</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="/help"><i className="bi bi-question-circle-fill me-2"></i>Help Center</Link></li>
                                    <li><Link className="dropdown-item" to="/account"><i className="bi bi-person-fill me-2"></i>Account</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={() => {
                                                logout();
                                                navigate("/");
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => navigate("/login")}
                                        >
                                            <i className="bi bi-box-arrow-in-right me-2"></i>Login
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => navigate("/signup")}
                                        >
                                            <i className="bi bi-person-plus-fill me-2"></i>Sign Up
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}