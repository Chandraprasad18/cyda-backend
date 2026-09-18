import mongoose from 'mongoose';

const policyItemSchema = new mongoose.Schema({
    category: { type: String, default: 'policies', lowercase: true, trim: true },
    title: { type: String, required: true, unique: true }, // unique ରଖାଗଲା ଯାହାଫଳରେ Duplicate ହେବ ନାହିଁ
    policyFile: { type: String, default: '' },
    reportLink: { type: String, default: '' }
}, { timestamps: true });

const PolicyItem = mongoose.model('PolicyItem', policyItemSchema);
export default PolicyItem;