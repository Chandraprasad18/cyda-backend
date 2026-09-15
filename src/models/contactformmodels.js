import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, default: "" },
    message: { type: String, required: false, default: "No message provided" } // <-- Made optional here
}, { timestamps: true });

const ContactForm = mongoose.model("ContactForm", contactSchema);

export default ContactForm;