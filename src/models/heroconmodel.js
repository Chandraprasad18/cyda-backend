import mongoose from "mongoose";

const heroContactSchema = new mongoose.Schema({
    contactPageName: { type: String, default: "CONTACT US" },
    contactCoverImage: { type: String, default: "./assets/Contact/ContactUsCoverImage.jpg" }
}, { timestamps: true });

const HeroContact = mongoose.model("HeroContact", heroContactSchema);
export default HeroContact;