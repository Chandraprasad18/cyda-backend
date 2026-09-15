import mongoose from 'mongoose';

const reportItemSchema = new mongoose.Schema({
    year: { type: String, required: false }, // Year optional, title use heba policies pain
    title: { type: String, required: false },
    reportLink: { type: String, default: '' }
});

const reportSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true, 
        unique: true, 
        enum: ['annualReports', 'auditReports', 'strategicPlan', 'policies'] // 'policies' added here
    },
    items: [reportItemSchema]
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;