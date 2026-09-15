import mongoose from 'mongoose';

const impactSchema = new mongoose.Schema({
    count: { type: String, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true }
}, { timestamps: true });

const Impact = mongoose.model('Impact', impactSchema);
export default Impact;