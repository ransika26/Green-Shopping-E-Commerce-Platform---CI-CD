
import express from "express";
import { Admincontacts } from "../controllers/Admin_contact_controller.js";
import  Admincontact from "../models/Admin_contact_platform.js";
const AdmincontactRouter = express.Router();

// Admin contact
AdmincontactRouter.post("/admincsendmessege", Admincontacts);


AdmincontactRouter.get("/", async (req, res) => {
    try {
      const contacts = await Admincontact.find(); 
      res.json(contacts); 
    } catch (err) {
      console.error("Error fetching Customers comments data: ", err);
      res.status(500).json({ message: "Error fetching  Customers comments data" });
    }
  });


  AdmincontactRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await Admincontact.findByIdAndDelete(id);
      if (!contact) {
        return res.status(404).json({ message: "Customer Admin Contact details not found" });
      }
      res.status(200).json({ message: "Customer Admin Contact details, deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting ,Customer Admin Contact details" });
    }
  });
  
export default AdmincontactRouter;
