import mongoose from "mongoose";

const storyHeroSchema = new mongoose.Schema({
    coverImage: { type: String, required: true },
    youthHeading: { type: String, default: "" },
    imageContentArray: [
        {
            image: { type: String, required: true },
            title: { type: String, required: true },
            pageName: { type: String, required: true },
            coverImage: { type: String, required: true } // Card click hele hero section re change heba pain
        }
    ]
}, { timestamps: true });

export default mongoose.model("StoryHero", storyHeroSchema);