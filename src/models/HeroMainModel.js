import mongoose from "mongoose";

const heroMainSchema = new mongoose.Schema({
    sectionKey: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    coverImage: { type: String, required: false } // Only hero banner image is kept here
}, { timestamps: true });

const HeroMain = mongoose.model("HeroMain", heroMainSchema);
export default HeroMain;