import mongoose from 'mongoose';

const categoryWiseDataSchema = new mongoose.Schema({
    image: { type: String, required: true },
    firstHead: { type: String, required: true },
    boldParaContent: { type: String },
    normalParagraph: { type: String }
}, { _id: false });

const imageContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    pageName: { type: String },
    coverImage: { type: String },
    categoryWiseData: categoryWiseDataSchema
}, { _id: false });

const programSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true, lowercase: true, trim: true },
    intro: { type: String, required: true },
    imageContentArray: [imageContentSchema]
}, { timestamps: true });

// 🔴 ଏଠାରେ ଟେବୁଲ୍/କଲେକ୍ସନ୍ ନାଁ 'programer_data' କରାଗଲା
const Program = mongoose.model('programer_datas', programSchema);

export default Program; 