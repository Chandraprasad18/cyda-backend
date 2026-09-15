import mongoose from 'mongoose';

const bePartnerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    financialSupport: { type: Boolean, default: false },
    inKindSupport: { type: Boolean, default: false },
    csr: { type: Boolean, default: false },
    other: { type: Boolean, default: false },
    otherText: { type: String }
}, { timestamps: true });

const BePartner = mongoose.model('BePartner', bePartnerSchema);
export default BePartner;