import mongoose from 'mongoose';

const socialChangeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    firstHead: { type: String, required: true },
    boldParaContent: { type: String, required: true },
    normalParagraph: { type: String, required: true },
    image: { type: String, default: '' }
}, { timestamps: true });

const SocialChange = mongoose.models.SocialChange || mongoose.model('SocialChange', socialChangeSchema);
export default SocialChange;