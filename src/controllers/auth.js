import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js'; 

// Register Admin
export const adminRegister = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ 
      email: normalizedEmail, 
      password: hashedPassword,
      role: role || 'admin' 
    });

    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// Login Admin
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      role: admin.role 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Temporary Reset Password Route (Default web@cydaindia.org ku Super Admin kariba pain)
export const resetAdminPassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const updated = await Admin.findOneAndUpdate(
      { email: 'web@cydaindia.org' },
      { password: hashedPassword, role: 'superadmin' }, 
      { upsert: true, new: true }
    );
    res.json({ message: 'Super Admin password reset to: Admin@123 & role set to superadmin', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// **Nua Super Admin Reset Password Function (By Email & New Password)**
export const superAdminResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found with this email' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ 
      success: true, 
      message: `Password successfully updated for ${normalizedEmail}` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
  }
};