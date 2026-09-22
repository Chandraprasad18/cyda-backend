import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'superadmin'], 
        default: 'admin' // By default nua admin "admin" (read-only) hebe
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;