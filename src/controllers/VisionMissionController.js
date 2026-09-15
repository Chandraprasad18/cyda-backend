import VisionMission from '../models/VisionMissionModel.js';

// GET Data
export const getVisionMission = async (req, res) => {
    try {
        const data = await VisionMission.findOne();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE / CREATE Data
export const updateVisionMission = async (req, res) => {
    try {
        const { vision, mission } = req.body;
        let updateData = { vision, mission };
        
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        let data = await VisionMission.findOne();
        if (data) {
            data = await VisionMission.findOneAndUpdate({}, updateData, { new: true });
        } else {
            data = new VisionMission(updateData);
            await data.save();
        }
        res.status(200).json({ success: true, message: "Updated Successfully", data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE Data
export const deleteVisionMission = async (req, res) => {
    try {
        const deletedData = await VisionMission.findOneAndDelete();
        if (!deletedData) {
            return res.status(404).json({ success: false, message: "No data found to delete" });
        }
        res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};