import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    title: { type: String, required: false },
    image: { type: String, required: false },
    categoryWiseData: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const heroMainSchema = new mongoose.Schema({
    sectionKey: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    coverImage: { type: String, required: false }, 
    youthHeading: { type: String, required: false }, 
    imageContentArray: [cardSchema]
}, { timestamps: true });

const HeroMain = mongoose.model("HeroMain", heroMainSchema);
export default HeroMain;