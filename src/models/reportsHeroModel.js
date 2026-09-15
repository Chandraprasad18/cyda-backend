import mongoose from "mongoose";

const reportsHeroSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("ReportsHero", reportsHeroSchema);