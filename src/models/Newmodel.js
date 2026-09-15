import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    title: { type: String },
    image: { type: String },
    firstHead: { type: String },
    boldParaContent: { type: String },
    normalParagraph: { type: String }
}, { timestamps: true });

// ଡାଟାବେସ୍‌ରେ କଲେକ୍ସନ୍ ନାମ 'newyouths' ରହିବ
const CategoryContent = mongoose.model('CategoryContent', categorySchema, 'newyouths');

export default CategoryContent;