import mongoose from 'mongoose';

const annualReportItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true }
});

const newAnnualSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true, default: 'annualReports' },
    items: [annualReportItemSchema]
}, { timestamps: true });

const NewAnnualReport = mongoose.model('NewAnnualReport', newAnnualSchema);
export default NewAnnualReport;