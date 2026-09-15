import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
    logo: { type: String, required: true }
}, { timestamps: true });

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;