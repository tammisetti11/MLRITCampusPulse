// client/src/pages/Account.jsx

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext"; // Assuming this provides user data and possibly update functions
import { Container, Row, Col, ListGroup, Form, Button, Image, InputGroup } from "react-bootstrap";
import { CameraFill, PersonCircle, TrashFill, Upload } from 'react-bootstrap-icons'; // For nicer icons
import axios from "axios"; // Optional, but keep if used elsewhere
import api from "../api/axios"; // ✅ Add this line


export default function Account() {
    const { user, updateUser } = useUser(); // Assuming useUser can also update user context after saving
    const [activeSection, setActiveSection] = useState("profile");

    // State for profile data (to be edited)
    const [profileData, setProfileData] = useState({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "", // Email is disabled, but good to have in state
        mobileNumber: user?.mobileNumber || "",
        addressStreet: user?.address?.street || "",
        addressCity: user?.address?.city || "",
        addressState: user?.address?.state || "",
        addressZip: user?.address?.zip || "",
        addressCountry: user?.address?.country || "",
        emergencyContactName: user?.emergencyContact?.name || "",
        emergencyContactRelationship: user?.emergencyContact?.relationship || "",
        emergencyContactPhone: user?.emergencyContact?.phone || "",
        gender: user?.gender || "",
        tshirtSize: user?.tshirtSize || "",
        dietaryRestrictions: user?.dietaryRestrictions || [], // Array for multiple selections
    });

    // State for profile photo upload
    const [profileImage, setProfileImage] = useState(user?.avatarUrl || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null); // Ref for hidden file input
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmNewPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match." });
            return;
        }

        try {
            const { data } = await api.put("/users/change-password", {
                currentPassword,
                newPassword,
            }, { withCredentials: true });

            setPasswordMessage({ type: "success", text: data.message });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            console.error(err);
            setPasswordMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to update password.",
            });
        }
    };
    // Effect to update profileData if user context changes (e.g., after initial load)
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ")[1] || "",
                email: user.email || "",
                mobileNumber: user.mobileNumber || "",
                addressStreet: user.address?.street || "",
                addressCity: user.address?.city || "",
                addressState: user.address?.state || "",
                addressZip: user.address?.zip || "",
                addressCountry: user.address?.country || "",
                emergencyContactName: user.emergencyContact?.name || "",
                emergencyContactRelationship: user.emergencyContact?.relationship || "",
                emergencyContactPhone: user.emergencyContact?.phone || "",
                gender: user.gender || "",
                tshirtSize: user.tshirtSize || "",
                dietaryRestrictions: user.dietaryRestrictions || [],
            });
            setProfileImage(user.avatarUrl || null);
        }
    }, [user]);


    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked, dataset } = e.target;

        if (dataset.parent === 'dietaryRestrictions') {
            // Handle multiple checkboxes for dietary restrictions
            setProfileData(prevData => {
                const updatedRestrictions = checked
                    ? [...prevData.dietaryRestrictions, value]
                    : prevData.dietaryRestrictions.filter(item => item !== value);
                return { ...prevData, dietaryRestrictions: updatedRestrictions };
            });
        } else {
            setProfileData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // Handle profile photo selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setProfileImage(URL.createObjectURL(file)); // Create URL for preview
            // Optional: Immediately trigger upload or show an "Upload" button
            // handleUploadProfilePhoto(file);
        }
    };

    // Handle click on profile image area to open file input
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Handle drag over
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setProfileImage(URL.createObjectURL(file));
        } else {
            alert("Please drop an image file.");
        }
    };

    // Simulate profile photo upload (replace with actual API call)
    const handleUploadProfilePhoto = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        try {
            // Replace with your actual API endpoint
            // const response = await axios.post('/api/upload-profile-image', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
            // Assuming the API returns the new avatar URL
            // setProfileImage(response.data.avatarUrl);
            // updateUser({ ...user, avatarUrl: response.data.avatarUrl }); // Update context
            // console.log("Profile photo uploaded:", response.data);

            // Simulate API call success
            await new Promise(resolve => setTimeout(resolve, 2000));
            // In a real app, 'newImageUrl' would come from the backend
            const newImageUrl = URL.createObjectURL(selectedFile); // Use the local URL for demo
            setProfileImage(newImageUrl);
            // Update user context (assuming updateUser is available)
            if (updateUser) {
                updateUser({ ...user, avatarUrl: newImageUrl });
            }
            setSelectedFile(null); // Clear selected file after "upload"
            alert("Profile photo uploaded successfully!");

        } catch (error) {
            console.error("Error uploading profile photo:", error);
            alert("Failed to upload profile photo.");
        } finally {
            setIsUploading(false);
        }
    };

    // Function to remove profile photo
    const handleRemoveProfilePhoto = () => {
        setProfileImage(null);
        setSelectedFile(null);
        // Optionally, make an API call to remove from backend
        // axios.delete('/api/remove-profile-image').then(() => {
        //     updateUser({ ...user, avatarUrl: null });
        //     alert("Profile photo removed.");
        // }).catch(error => console.error("Error removing photo:", error));
    };


    // Handle Save Changes for Contact Information
    const handleProfileSave = async (e) => {
        e.preventDefault();
        // Here you would typically send profileData to your backend API
        console.log("Saving profile changes:", profileData);

        try {
            // Example API call (replace with your actual endpoint)
            // const response = await axios.put('/api/user/profile', profileData);
            // Assuming backend returns updated user object
            // if (updateUser) {
            //     updateUser(response.data); // Update user context
            // }
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            alert("Profile updated successfully!");

            // Example of updating user context manually for demo
            if (updateUser) {
                const updatedUser = {
                    ...user,
                    name: `${profileData.firstName} ${profileData.lastName}`,
                    mobileNumber: profileData.mobileNumber,
                    address: {
                        street: profileData.addressStreet,
                        city: profileData.addressCity,
                        state: profileData.addressState,
                        zip: profileData.addressZip,
                        country: profileData.addressCountry,
                    },
                    emergencyContact: {
                        name: profileData.emergencyContactName,
                        relationship: profileData.emergencyContactRelationship,
                        phone: profileData.emergencyContactPhone,
                    },
                    gender: profileData.gender,
                    tshirtSize: profileData.tshirtSize,
                    dietaryRestrictions: profileData.dietaryRestrictions,
                };
                updateUser(updatedUser);
            }

        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile changes.");
        }
    };


    const renderSection = () => {
        switch (activeSection) {
            case "profile":
                return (
                    <>
                        <h4 className="mb-4 fw-bold" style={{ color: "#FF6B00" }}>Account Information</h4>

                        {/* Profile Photo Section */}
                        <div className="mb-5 p-3 border rounded bg-light">
                            <h5 className="fw-semibold mb-3">Profile Photo</h5>
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                {/* Image display area */}
                                <div
                                    className="position-relative d-flex align-items-center justify-content-center border rounded-circle bg-white shadow-sm me-md-4 mb-3 mb-md-0"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        transition: "transform 0.2s ease",
                                    }}
                                    onClick={handleImageClick}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    {profileImage ? (
                                        <Image src={profileImage} alt="Profile" fluid roundedCircle style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div className="text-center text-muted">
                                            <PersonCircle style={{ fontSize: "3rem" }} />
                                            <p className="small mb-0">Upload Image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    {!profileImage && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded-circle">
                                            <CameraFill className="text-white fs-3" />
                                        </div>
                                    )}
                                </div>
                                {/* Upload/Remove Buttons */}
                                <div className="d-flex flex-column gap-2">
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleUploadProfilePhoto}
                                        disabled={!selectedFile || isUploading}
                                        className="rounded-pill"
                                    >
                                        {isUploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="me-2" /> Upload Photo
                                            </>
                                        )}
                                    </Button>
                                    {profileImage && (
                                        <Button
                                            variant="outline-danger"
                                            onClick={handleRemoveProfilePhoto}
                                            disabled={isUploading}
                                            className="rounded-pill"
                                        >
                                            <TrashFill className="me-2" /> Remove Photo
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="p-3 border rounded mb-4 bg-light">
                            <h5 className="fw-semibold mb-3">Contact Information</h5>
                            <Form onSubmit={handleProfileSave}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" name="firstName" placeholder="First Name" value={profileData.firstName} onChange={handleChange} className="rounded-pill" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" name="lastName" placeholder="Last Name" value={profileData.lastName} onChange={handleChange} className="rounded-pill" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Email" value={profileData.email} disabled className="rounded-pill bg-light" />
                                    <Form.Text className="text-muted">Email cannot be changed here.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control type="tel" name="mobileNumber" placeholder="e.g., +91 9876543210" value={profileData.mobileNumber} onChange={handleChange} className="rounded-pill" />
                                </Form.Group>
                            </Form>
                        </div>

                        {/* Address Section */}
                        <div className="p-3 border rounded mb-4 bg-light">
                            <h5 className="fw-semibold mb-3">Address</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control type="text" name="addressStreet" placeholder="123 Main St" value={profileData.addressStreet} onChange={handleChange} className="rounded-pill" />
                            </Form.Group>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>City</Form.Label>
                                        <Form.Control type="text" name="addressCity" placeholder="City" value={profileData.addressCity} onChange={handleChange} className="rounded-pill" />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>State/Province</Form.Label>
                                        <Form.Control type="text" name="addressState" placeholder="State" value={profileData.addressState} onChange={handleChange} className="rounded-pill" />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control type="text" name="addressZip" placeholder="Zip" value={profileData.addressZip} onChange={handleChange} className="rounded-pill" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" name="addressCountry" placeholder="Country" value={profileData.addressCountry} onChange={handleChange} className="rounded-pill" />
                            </Form.Group>
                        </div>

                        {/* Emergency Contact */}
                        <div className="p-3 border rounded mb-4 bg-light">
                            <h5 className="fw-semibold mb-3">Emergency Contact</h5>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Contact Name</Form.Label>
                                        <Form.Control type="text" name="emergencyContactName" placeholder="Name" value={profileData.emergencyContactName} onChange={handleChange} className="rounded-pill" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Relationship</Form.Label>
                                        <Form.Control type="text" name="emergencyContactRelationship" placeholder="Relationship" value={profileData.emergencyContactRelationship} onChange={handleChange} className="rounded-pill" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label>Contact Phone</Form.Label>
                                <Form.Control type="tel" name="emergencyContactPhone" placeholder="e.g., +91 9876543210" value={profileData.emergencyContactPhone} onChange={handleChange} className="rounded-pill" />
                            </Form.Group>
                        </div>

                        {/* Save Button */}
                        <div className="text-end">
                            <Button type="submit" onClick={handleProfileSave} className="rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: "#FF6B00", border: "none" }}>
                                Update Profile
                            </Button>
                        </div>
                    </>
                );

            case "security":
                return (
                    <>
                        <h4 className="mb-3">Change Password</h4>
                        <p>Update your account password securely.</p>
                        {passwordMessage && <div className={`alert ${passwordMessage.type === "error" ? "alert-danger" : "alert-success"} mt-2`}>{passwordMessage.text}</div>}
                        <form onSubmit={handlePasswordChange} className="mt-3">
                            <div className="mb-3">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-pill"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-pill"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-pill"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-warning rounded-pill">
                                <i className="bi bi-shield-lock me-1"></i> Update Password
                            </button>
                        </form>
                    </>
                );
            case "payments":
                return (
                    <>
                        <h4 className="mb-3">Payment Methods</h4>
                        <hr />
                        <p>Manage your saved payment methods.</p>
                        <Button variant="primary">Add Payment Method</Button>
                    </>
                );
            case "close":
                return (
                    <>
                        <h4 className="mb-3 text-danger">Close Account</h4>
                        <hr />
                        <p className="text-danger">
                            Warning: Closing your account will permanently remove your data. This action cannot be undone.
                        </p>
                        <Button variant="danger">Close My Account</Button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Container fluid="md" className="my-5">
            <Row>
                {/* Sidebar */}
                <Col md={3} className="mb-4">
                    <ListGroup variant="flush">
                        <ListGroup.Item
                            action
                            active={activeSection === "profile"}
                            onClick={() => setActiveSection("profile")}
                        >
                            Profile
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            active={activeSection === "security"}
                            onClick={() => setActiveSection("security")}
                        >
                            Security
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            active={activeSection === "payments"}
                            onClick={() => setActiveSection("payments")}
                        >
                            Payment Methods
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            active={activeSection === "close"}
                            onClick={() => setActiveSection("close")}
                            className="text-danger"
                        >
                            Close Account
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                {/* Content */}
                <Col md={9}>
                    <div className="bg-white border rounded shadow-sm p-4">
                        {renderSection()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}