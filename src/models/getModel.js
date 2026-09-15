import mongoose from 'mongoose';

const getModelSchema = new mongoose.Schema({
    segment: { 
        type: String, 
        required: true, 
        unique: true,
        enum: ['youth', 'gender', 'adolescent', 'socialchange', 'contact'] 
    },
    title: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    firstHead: { type: String, required: true },
    boldParaContent: { type: String, required: true },
    normalParagraph: { type: String, required: true }
}, { timestamps: true });

const GetModel = mongoose.model('GetModel', getModelSchema);
export default GetModel;