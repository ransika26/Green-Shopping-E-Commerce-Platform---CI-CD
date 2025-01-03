import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const Admincontact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/Admincontact")
      .then((response) => {
        setContacts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Customer, Admin Contact data:", error);
        alert("Error fetching Customer, Admin Contact data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const deletecontact = (id) => {
    axios
      .delete(`http://localhost:3000/api/Admincontact/${id}`)
      .then((response) => {
        console.log("Contacts detail deleted successfully", response);
        setContacts(contacts.filter((contact) => contact._id !== id));
        alert("Contacts detail deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting Contacts detail:", error);
        alert("Error deleting Contacts detail. Please try again.");
      });
  };

  const handleReplyClick = (email) => {
    setEmailForm({ to: email, subject: "", messaget: "" });
    setShowPopup(true);
  };

  const handleSendEmail = async () => {
    try {
      const emailPayload = {
        to: emailForm.to,          
        subject: emailForm.subject, 
        text: emailForm.message,    


 };
  
      await axios.post("http://localhost:3000/api/email/send-email", emailPayload);
      alert("Email sent successfully!");
      setShowPopup(false);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p className="sadmin">Welcome to the admin dashboard.</p>

      <h2 className="sadmin">Admin Notifications</h2>

      {contacts.length > 0 ? (
        <div className="table-container-sadmin">
          <table className="sadmin">
            <thead>
              <tr>
                <th className="sadmin">Contact Name</th>
                <th className="sadmin">Email</th>
                <th className="sadmin">Message</th>
                <th className="sadmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td className="sadmin">{contact.Name}</td>
                  <td className="sadmin">{contact.Email}</td>
                  <td className="sadmin">{contact.Message}</td>
                  <td className="action-buttons">
         <button className="sadmin" onClick={() => deletecontact(contact._id)}
              style={{ color: "orange" }} > Delete</button>
         <button className="sadmin"   onClick={() => handleReplyClick(contact.Email)}
              style={{ color: "orange" }} > Reply </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="sadmin">No Customer, Admin Contact details found.</p>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Send Email</h3>
            <form>
        <label> To:
          <input type="email" name="to" value={emailForm.to} onChange={handleInputChange} readOnly />
        </label>
        <label> Subject:
          <input type="text" name="subject" value={emailForm.subject} onChange={handleInputChange}/>
        </label>
        <label> Message:
          <textarea name="message" value={emailForm.message} onChange={handleInputChange}/>
        </label>
            <button type="button" onClick={handleSendEmail}> Send </button>
            <button type="button" onClick={() => setShowPopup(false)}> Close </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admincontact;
