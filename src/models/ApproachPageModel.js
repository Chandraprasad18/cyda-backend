import mongoose from "mongoose";

const approachPageSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    imageUrl: { type: String, required: true },
    boldContent: { type: String, required: true },
    paragraph: { type: String, required: true },
    orderIndex: { type: Number, default: 0 }
}, { timestamps: true });

const ApproachPageModel = mongoose.model("ApproachPage", approachPageSchema);
export default ApproachPageModel;