import express from 'express';
import { loginAdmin } from '../controllers/Admin_Login_Controller.js'; 

const PrivateRoute = express.Router();

// Admin Login Route
PrivateRoute.post('/login', loginAdmin);




export default PrivateRoute;
