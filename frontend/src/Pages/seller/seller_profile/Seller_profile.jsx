import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./seller_profile.css";

const Seller_profile = () => {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("sellerId");
  const [seller, setSeller] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    SellerName: "",
    SellerEmail: "",
    SellerAddress: "",
    SellerPhoneNumber: "",
    SellerGeolocation: "",
  });
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/selleraccount/${sellerId}`
        );
        setSeller(response.data);
        setEditData({
          SellerName: response.data.SellerName,
          SellerEmail: response.data.SellerEmail,
          SellerAddress: response.data.SellerAddress,
          SellerPhoneNumber: response.data.SellerPhoneNumber,
          SellerGeolocation: response.data.SellerGeolocation,
        });
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    if (sellerId) {
      fetchSellerDetails();
    }
  }, [sellerId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLogoImage(e.target.files[0]);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("SellerName", editData.SellerName);
    formData.append("SellerEmail", editData.SellerEmail);
    formData.append("SellerAddress", editData.SellerAddress);
    formData.append("SellerPhoneNumber", editData.SellerPhoneNumber);
    formData.append("SellerGeolocation", editData.SellerGeolocation);
    if (logoImage) {
      formData.append("LogoImageFile", logoImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/selleraccount/${sellerId}`,
        formData
      );
      setSeller(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating seller details:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3000/api/selleraccount/${sellerId}`
        );
        localStorage.removeItem("sellerId");
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div>
      {seller ? (
        <div className="seller-profile-con">
          {isEditing ? (
            <div className="seller-profile-edit-con">
              <label>Name</label>
              <input
                type="text"
                name="SellerName"
                value={editData.SellerName}
                onChange={handleEditChange}
                placeholder="Name"
              />
              <label>Email</label>
              <input
                type="email"
                name="SellerEmail"
                value={editData.SellerEmail}
                onChange={handleEditChange}
                placeholder="Email"
              />
              <label>Address</label>
              <input
                type="text"
                name="SellerAddress"
                value={editData.SellerAddress}
                onChange={handleEditChange}
                placeholder="Address"
              />
              <label>Phone Number</label>
              <input
                type="text"
                name="SellerPhoneNumber"
                value={editData.SellerPhoneNumber}
                onChange={handleEditChange}
                placeholder="Phone Number"
              />
              <label>Geolocation</label>
              <input
                type="text"
                name="SellerGeolocation"
                value={editData.SellerGeolocation}
                onChange={handleEditChange}
                placeholder="Geolocation"
              />
              <label>Logo Image</label>
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleEditSubmit}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <>
              {seller?.LogoImageFile ? (
                <img
                  className="seller-profile-image"
                  src={`http://localhost:3000/uploads/${seller.LogoImageFile}`}
                  alt={seller.LogoImageFile}
                />
              ) : (
                <p>No image available</p>
              )}
              <div className="seller-profile-detail-con">
                <div className="seller-profile-detail">
                  <h5 className="seller-profile-topic">Seller ID:</h5>
                  <p className="seller-profile-p">{seller._id}</p>
                </div>
                <div className="seller-profile-detail">
                  <h5 className="seller-profile-topic">Seller Name:</h5>
                  <p className="seller-profile-p">{seller.SellerName}</p>
                </div>
                <div className="seller-profile-detail">
                  <h5 className="seller-profile-topic">Seller Email:</h5>
                  <p className="seller-profile-p">{seller.SellerEmail}</p>
                </div>
                <div className="seller-profile-detail">
                  <h5 className="seller-profile-topic">Seller Address:</h5>
                  <p className="seller-profile-p">{seller.SellerAddress}</p>
                </div>
                <div className="seller-profile-detail">
                  <h5 className="seller-profile-topic">Seller PhoneNumber:</h5>
                  <p className="seller-profile-p">{seller.SellerPhoneNumber}</p>
                </div>
                <div className="seller-profile-detail">
                  <h5 className="seller-profile-topic">Geolocation:</h5>
                  <p className="seller-profile-p">{seller.SellerGeolocation}</p>
                </div>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                <button onClick={handleDeleteAccount}>Delete Profile</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Loading seller details...</p>
      )}
    </div>
  );
};

export default Seller_profile;
