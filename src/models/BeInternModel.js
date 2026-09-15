import mongoose from 'mongoose';

const beInternSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    ageOrDob: { type: String, required: true },
    collegeName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }
}, { timestamps: true });

const BeIntern = mongoose.model('BeIntern', beInternSchema);
export default BeIntern;