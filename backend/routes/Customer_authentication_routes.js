import express from "express";
import {
  CustomerLogin,
  CustomerSignup,
} from "../controllers/Customer_authentication_controller.js";
import customerauthentication from "../models/Customer_authentication_platform.js";
const CustomerAuthenticationRouter = express.Router();

// Customer signup
CustomerAuthenticationRouter.post("/customersignup", CustomerSignup);

// Customer login
CustomerAuthenticationRouter.post("/customerlogin", CustomerLogin);


// Fetch all customer data
CustomerAuthenticationRouter.get("/", async (req, res) => {
  try {
    const customers = await customerauthentication.find(); 
    res.json(customers); // Send as JSON response
  } catch (err) {
    console.error("Error fetching Customers data: ", err);
    res.status(500).json({ message: "Error fetching  Customers data" });
  }
});



CustomerAuthenticationRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await customerauthentication.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting Customer" });
  }
});


// Getting all customers count,for notification............... 
CustomerAuthenticationRouter.get("/total-customers", async (req, res) => {
  try {
    const totalCustomers = await customerauthentication.countDocuments(); 
    console.log("Total customers Count:", totalCustomers);
    res.json({ totalCustomers });
  } catch (err) {
    console.error("Error fetching total sellers:", err);
    res.status(500).json({ message: "Error fetching total sellers" });
  }
});
export default CustomerAuthenticationRouter;
