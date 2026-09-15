import mongoose from "mongoose";

const aboutHeroSchema = new mongoose.Schema({
    headingLine1: { type: String, required: true },
    headingLine2: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("AboutHero", aboutHeroSchema);