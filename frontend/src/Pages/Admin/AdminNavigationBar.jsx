import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    // Redirect to login page
    navigate("/Admin/Admin_Login");
  };

  return (
    <nav className="admin-navbar">
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/Admin/sellerdetails"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Seller Details
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Admin/CustomerDetails"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Customer Details
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Admin/Customer_Order_Details"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Order Details
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Admin/Admin_Notification"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Customer Requests and Complaints
          </NavLink>
        </li>
        <li className="logout-icon" onClick={handleLogout}>
          <img
            src="logout-icon.png"
            alt="Logout"
            title="Logout"
            className="logout-image"
          />
        </li>
        
      </ul>
    </nav>
  );
};

export default AdminNavbar;
