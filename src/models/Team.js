import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Member name is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Member title/designation is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['founding', 'executive', 'additional', 'senior', 'program', 'extended'],
        lowercase: true,
        trim: true
    },
    profileImage: {
        type: String,
        required: false,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);
export default Team;