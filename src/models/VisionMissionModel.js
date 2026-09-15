import mongoose from 'mongoose';

const visionMissionSchema = new mongoose.Schema({
    vision: { type: String, required: true },
    mission: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

const VisionMission = mongoose.model('VisionMission', visionMissionSchema);

export default VisionMission;