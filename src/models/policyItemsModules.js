import mongoose from 'mongoose';

const policyItemSchema = new mongoose.Schema({
    category: { type: String, default: 'policy', lowercase: true, trim: true },
    title: { type: String, required: true },
    policyFile: { type: String, default: '' }
}, { timestamps: true });

const PolicyItem = mongoose.model('PolicyItem', policyItemSchema);
export default PolicyItem;