import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const CustomerDetail = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all Customer authentication data from the backend
    axios
      .get("http://localhost:3000/api/customerauthentication")
      .then((response) => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Customer data:", error);
        alert("Error fetching Customer data. Please try again later."); 
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const deletecustomer = (id) => {
    axios
      .delete(`http://localhost:3000/api/customerauthentication/${id}`)
      .then((response) => {
        console.log("Customer deleted successfully", response);
        setCustomers(customers.filter((customer) => customer._id !== id));
        alert("Customer deleted successfully!"); 
      })
      .catch((error) => {
        console.error("Error deleting Customer:", error);
        alert("Error deleting customer. Please try again."); 
      });
  };

  return (
    <div>
      
      <p className="sadmin">Welcome to the admin dashboard.</p>

      <h2 className="sadmin">Customer Accounts</h2>

      {customers.length > 0 ? (
        <div className="table-container-sadmin">
          <table className="sadmin">
            <thead>
              <tr>
                <th className="sadmin">Customer Name</th>
                <th className="sadmin" >Email</th>
                <th className="sadmin">Address</th>
                <th className="sadmin">Phone Number</th>
                <th className="sadmin"> Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="sadmin">{customer.CustomerName}</td>
                  <td className="sadmin">{customer.CustomerEmail}</td>
                  <td className="sadmin">{customer.CustomerAddress}</td>
                  <td className="sadmin">{customer.CustomerPhoneNumber}</td>
                  <td className="action-buttons">
                    <button className="sadmin"
                      onClick={() => deletecustomer(customer._id)}
                      style={{ color: "orange" }}
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
        <p>No Customer authentication requests found.</p>
      )}
    </div>
  );
};

export default CustomerDetail;
