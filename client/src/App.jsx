import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";
import Payment from "./pages/Payment";
import PaymentPage from "./pages/PaymentPage";
import TicketPage from "./pages/TicketPage";
import MyTickets from "./pages/MyTickets";


// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Interested from "./pages/Interested";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Account from "./pages/Account";



export default function App() {
  return (
    <BrowserRouter>
      {/* persistent header */}
      <Header />

      {/* routed content */}
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* admin protected */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-event"
          element={
            <ProtectedRoute adminOnly={true}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-event/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route path="/account" element={<Account />} />
        <Route path="/interested" element={<Interested />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/events/:id/payment" element={<PaymentPage />} />
        <Route path="/admin/create-event" element={<ProtectedRoute adminOnly={true}><CreateEvent /></ProtectedRoute>} />
        <Route path="/admin/edit-event/:id" element={<ProtectedRoute adminOnly={true}><EditEvent /></ProtectedRoute>} />
        <Route path="/tickets/:ticketId" element={<TicketPage />} />
        <Route path="/my-tickets" element={<MyTickets />} />

      </Routes>

    </BrowserRouter>
  );
}
