import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavigationBar";
import { Outlet } from "react-router-dom"; 
import axios from "axios";
import "./AdminNavbar.css";
import "./Admindashboard.css"; 

const Admin = () => {
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalCustomers: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all data
    const fetchStats = async () => {
      try {
        const [sellersRes, customersRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/api/sellers/total-sellers"), 
          axios.get("http://localhost:3000/api/customerauthentication/total-customers"),
          axios.get("http://localhost:3000/api/orders/total-orders"),
        ]);

        setStats({
          totalSellers: sellersRes.data.totalSellers,
          totalCustomers: customersRes.data.totalCustomers,
          totalOrders: ordersRes.data.totalOrders,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        alert("Error fetching stats. Please try again later.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page-wrapper">
      <AdminNavbar />
      <main className="admin-main-content-section">
       
        <div className="admin-stats-container">
          <div className="admin-stat-card admin-stat-sellers">
            <h3 className="admin-stat-title">Total Sellers</h3>
            <p className="admin-stat-value">{stats.totalSellers}</p>
          </div>
          <div className="admin-stat-card admin-stat-customers">
            <h3 className="admin-stat-title">Total Customers</h3>
            <p className="admin-stat-value">{stats.totalCustomers}</p>
          </div>
          <div className="admin-stat-card admin-stat-orders">
            <h3 className="admin-stat-title">Total Orders</h3>
            <p className="admin-stat-value">{stats.totalOrders}</p>
          </div>
          
        </div>
        <h1 className="admin-main-title">Welcome to the Admin Dashboard</h1>
        <Outlet /> 
      </main>
    </div>
  );
};

export default Admin;
