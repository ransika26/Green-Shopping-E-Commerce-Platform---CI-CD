import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/orders/")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Customer order data:", error);
        alert("Error fetching Customer order data. Please try again later."); 
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      
      <p className="sadmin">Welcome to the admin dashboard.</p>

      <h2 className="sadmin">Customer Order History</h2>

      {orders.length > 0 ? (
        <div className="table-container-sadmin">
          <table className="sadmin">
            <thead>
              <tr>
                <th className="sadmin">Customer ID</th>
                <th className="sadmin" >Total Order Amount [$]</th>
                <th className="sadmin">Order Status</th>
                <th className="sadmin">Created Date/Time</th>
                
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="sadmin">{order.customerId}</td>
                  <td className="sadmin">{order.totalAmount}</td>
                  <td className="sadmin">{order.paymentStatus}</td>
                  <td className="sadmin">{order.orderDate}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Customer Orders found.</p>
      )}
    </div>
  );
};

export default CustomerOrder;
