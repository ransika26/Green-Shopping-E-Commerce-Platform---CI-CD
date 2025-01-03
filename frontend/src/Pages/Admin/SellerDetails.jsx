import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const SellerDetail = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all seller authentication data from the backend
    axios
      .get("http://localhost:3000/api/sellerauthentication")
      .then((response) => {
        setSellers(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching seller data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const deleteSeller = (id) => {
    axios
      .delete(`http://localhost:3000/api/sellerauthentication/${id}`)
      .then((response) => {
        console.log("Seller deleted successfully", response);
        setSellers(sellers.filter(seller => seller._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting seller:", error);
      });
  };

  const updateSellerStatus = (id, status) => {
    axios
      .put(`http://localhost:3000/api/sellerauthentication/${id}`, { status })
      .then((response) => {
        setSellers(
          sellers.map((seller) =>
            seller._id === id ? { ...seller, Status: status } : seller
          )
        );
      })
      .catch((error) => console.error("Error updating seller status:", error));
  };

  return (
    <div>
      
      <p className="sadmin">Welcome to the admin dashboard.</p>

      <h2 className="sadmin">Seller Authentication Requests</h2>

      {sellers.length > 0 ? (
        <div className="table-container-sadmin">
          <table className="sadmin">
            <thead>
              <tr>
                <th className="sadmin">Seller Name</th>
                <th className="sadmin">Email</th>
                <th className="sadmin">Address</th>
                <th className="sadmin">Phone Number</th>
                <th className="sadmin">Geolocation</th>
                <th className="sadmin">Status</th>
                <th className="sadmin">Logo Image</th>
                <th className="sadmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td className="sadmin">{seller.SellerName}</td>
                  <td className="sadmin">{seller.SellerEmail}</td>
                  <td className="sadmin">{seller.SellerAddress}</td>
                  <td className="sadmin">{seller.SellerPhoneNumber}</td>
                  <td className="sadmin">{seller.SellerGeolocation}</td>
                  <td className="sadmin">{seller.Status}</td>
                  <td>
                    <img className="sadmin"
                      src={`http://localhost:3000/uploads/${seller.LogoImageFile}`}
                      alt="Seller Logo"
                      width="50"
                      height="50"
                    />
                  </td>
                  <td className="action-buttons-sadmin">
                    <button className="sadmin"
                      onClick={() => updateSellerStatus(seller._id, "accepted")}
                    
                    >
                      Accept
                    </button>
                    <button className="sadmin"
                      onClick={() => updateSellerStatus(seller._id, "rejected")}
                     
                    >
                      Reject
                    </button>
                    <button className="sadmin"
                      onClick={() => deleteSeller(seller._id)}
                     
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No seller authentication requests found.</p>
      )}
    </div>
  );
};

export default SellerDetail;
