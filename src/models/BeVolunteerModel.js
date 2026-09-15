import mongoose from 'mongoose';

const beVolunteerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    ageOrDob: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }
}, { timestamps: true });

const BeVolunteer = mongoose.model('BeVolunteer', beVolunteerSchema);
export default BeVolunteer;