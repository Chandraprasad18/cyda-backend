import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  address: { type: String, required: true },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  bankDetails: {
    bankName: { type: String, default: '' },
    accountHolder: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    branch: { type: String, default: '' },
    micrCode: { type: String, default: '' }
  },
  images: {
    logoImage: { type: String, default: '' },
    footerImage: { type: String, default: '' }
  },
  copyrightText: { type: String, default: '' }
}, { timestamps: true });

// Prevents re-declaration error
const Footer = mongoose.models.Footer || mongoose.model('Footer', footerSchema);

export default Footer;