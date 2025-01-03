import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Admin_Login.css"; 

const Admin_login = () => {
  const [formData, setFormData] = useState({
    AdminEmail: "",
    AdminPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.AdminEmail.trim()) {
      newErrors.AdminEmail = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.AdminEmail)
    ) {
      newErrors.AdminEmail = "Invalid email address.";
    }
    if (!formData.AdminPassword.trim()) {
      newErrors.AdminPassword = "Password is required.";
    } else if (formData.AdminPassword.length < 6) {
      newErrors.AdminPassword = "Password must be at least 6 characters.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/login", 
        formData
      );

      if (response.data.message === "Login successful!") {
       
        localStorage.setItem("admintoken", response.data.token);
        localStorage.setItem("adminId", response.data.adminId);
        localStorage.setItem("adminEmail", formData.AdminEmail);
        console.log("Login successful:", response.data);
        alert("Welcome back, Admin!");
       
        // Redirect to dashboard

     navigate("/Admin/Admin");
      } else {
        setApiError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error.response ? error.response.data.message : error.message);
      setApiError(error.response ? error.response.data.message : "An error occurred. Please try again later.");
    }
  };

  return (
    <div className="seller-login-main">
      
      <div className="seller-login-con">
        <h3 className="text-hili">Admin Login</h3>
        <form className="gap" onSubmit={handleSubmit}>
          <div className="seller-login-input-box">
            <input
              type="text"
              name="AdminEmail"
              placeholder="Admin email"
              value={formData.AdminEmail}
              onChange={handleChange}
            />
            {errors.AdminEmail && (
              <p className="error">{errors.AdminEmail}</p>
            )}
          </div>
          <div className="seller-login-input-box">
            <input
              type="password"
              name="AdminPassword"
              placeholder="Password"
              value={formData.AdminPassword}
              onChange={handleChange}
            />
            {errors.AdminPassword && (
              <p className="error">{errors.AdminPassword}</p>
            )}
          </div>
          {apiError && <p className="error">{apiError}</p>}
          <button className="seller-login-button" type="submit">
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Admin_login;
