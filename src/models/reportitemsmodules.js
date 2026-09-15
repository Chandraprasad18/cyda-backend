import mongoose from 'mongoose';

const reportItemSchema = new mongoose.Schema({
    category: { type: String, required: true, lowercase: true, trim: true },
    year: { type: String, required: true },
    reportUrl: { type: String, required: true }
}, { timestamps: true });

// Eithi export default use karibaku heba
const ReportItem = mongoose.model('ReportItem', reportItemSchema);
export default ReportItem;