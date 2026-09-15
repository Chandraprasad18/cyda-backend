import mongoose from 'mongoose';

const youthHeroSchema = new mongoose.Schema({
    sectionName: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    coverImage: { 
        type: String, 
        required: true 
    },
    youthHeading: { 
        type: String, 
        required: true 
    },
    imageContentArray: [
        {
            image: { type: String, required: true },
            title: { type: String, required: true },
            categoryWiseData: { type: mongoose.Schema.Types.Mixed }
        }
    ]
}, { timestamps: true });

const YouthHero = mongoose.model('YouthHero', youthHeroSchema);
export default YouthHero;