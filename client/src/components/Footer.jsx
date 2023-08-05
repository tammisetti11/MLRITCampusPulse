// client/src/components/Footer.jsx

import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-5">
            <div className="container">
                <div className="row">
                    {/* Left: Logo + Address */}
                    <div className="col-md-4 mb-4">
                        <img src={logo} style={{ width: "150px" }} className="mb-3" />
                        <p>MLRIT CampusPulse</p>
                    </div>

                    {/* Middle: Resources */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-warning">CampusPulse Resources</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about" className="text-decoration-none text-light">About CampusPulse</Link></li>
                            <li><Link to="/contact" className="text-decoration-none text-light">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Right: Follow */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-warning">Follow CampusPulse</h5>
                        <div className="d-flex gap-3 fs-4 mt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light"><FaFacebookF /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light"><FaXTwitter /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light"><FaInstagram /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light"><FaLinkedinIn /></a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light"><FaYoutube /></a>
                        </div>
                    </div>
                </div>

                <hr className="border-secondary" />
            </div>
        </footer>
    );
}
