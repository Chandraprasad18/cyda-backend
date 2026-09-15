import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    section: { 
        type: String, 
        required: true, 
        enum: ['approach', 'adolescent', 'youth', 'gender', 'socialchange', 'reports', 'team', 'branches', 'contact', 'landingPage'] 
    },
    storyId: { 
        type: Number, 
        required: false, 
        default: 1 
    },
    storyContent: { 
        type: String, 
        required: true 
    },
    link: { 
        type: String, 
        required: false, 
        default: "https://cydaindia.org" 
    },
    thumbnail: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
export default Story;