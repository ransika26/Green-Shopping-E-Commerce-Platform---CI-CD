import Admin from '../models/Admin_Login_Platform.js';


export async function loginAdmin(req, res) {
  console.log("Request body:", req.body);
  const { AdminEmail: email, AdminPassword: password } = req.body;

  try {
    
    let admin = await Admin.findOne({ email });
    console.log('Received email:', email);
    console.log('Received password:', password);

    if (!admin) {
      const defaultAdminEmail = "admin@gmail.com";

     
      admin = await Admin.findOne({ email: defaultAdminEmail });

      // If the default admin also doesn't exist, create it
      if (!admin) {
        const hashedPassword = await Admin.hashPassword("adminpassword"); 
        admin = new Admin({
          email: defaultAdminEmail,
          password: hashedPassword,
        });

        await admin.save();
        return res.status(200).json({
          message: 'No admin found. Created a default admin account.',
          adminId: admin._id,
        });
      }

      
      return res.status(404).json({
        message: `No admin found with email "${email}". Use the correct credentials to log in.`,
      });
    }

    // Check password 
    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    
    res.status(200).json({ message: 'Login successful!', adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error!', error: error.message });
  }
}
