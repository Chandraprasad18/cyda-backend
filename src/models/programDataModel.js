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
    categoryWiseData: { 
        type: categoryWiseDataSchema,
        required: true 
    }
}, { _id: false });

const programDataSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true,
        enum: ['youth', 'adolescent', 'gender', 'socialchange'] // ଆପଣଙ୍କ categories
    },
    intro: { type: String, required: true },
    imageContentArray: { 
        type: [imageContentSchema],
        default: [] 
    }
}, { timestamps: true });

const ProgramData = mongoose.model('program_datas', programDataSchema);

export default ProgramData;