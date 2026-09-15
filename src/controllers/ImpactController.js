import Impact from '../models/ImpactModel.js';

// ସବୁ ଡାଟା ଆଣିବା ପାଇଁ
export const getImpacts = async (req, res) => {
    try {
        const data = await Impact.find();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ନୂଆ ଡାଟା ଯୋଡିବା ପାଇଁ (Add)
export const createImpact = async (req, res) => {
    try {
        const { count, title } = req.body;
        let imagePath = '';
        
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const newItem = new Impact({ count, title, imagePath });
        await newItem.save();
        res.status(201).json({ success: true, message: "Impact added successfully", data: newItem });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ଡାଟା ଅପଡେଟ୍ କରିବା ପାଇଁ (Edit/Update)
export const updateImpact = async (req, res) => {
    try {
        const { id } = req.params;
        const { count, title } = req.body;
        let updateData = { count, title };

        if (req.file) {
            updateData.imagePath = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await Impact.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Impact item not found" });
        }

        res.status(200).json({ success: true, message: "Updated successfully", data: updatedItem });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ଡାଟା ଡିଲିଟ୍ କରିବା ପାଇଁ (Delete)
export const deleteImpact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Impact.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Impact item not found" });
        }
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};