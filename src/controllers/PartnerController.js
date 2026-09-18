import Partner from '../models/PartnerModel.js';

// ସବୁ ପାର୍ଟନର ଲୋଗୋ ଆଣିବା ପାଇଁ
export const getPartners = async (req, res) => {
    try {
        const data = await Partner.find();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ନୂଆ ଲୋଗୋ ଆଡ୍ କରିବା ପାଇଁ
export const createPartner = async (req, res) => {
    try {
        let logoPath = '';
        if (req.file) {
            logoPath = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ success: false, message: "Logo image is required" });
        }

        const newPartner = new Partner({ logo: logoPath });
        await newPartner.save();
        res.status(201).json({ success: true, message: "Logo added successfully", data: newPartner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ଲୋଗୋ ଅପଡେଟ୍ କରିବା ପାଇଁ
export const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = {};

        if (req.file) {
            updateData.logo = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ success: false, message: "Please select a new logo image" });
        }

        const updatedPartner = await Partner.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPartner) {
            return res.status(404).json({ success: false, message: "Partner not found" });
        }

        res.status(200).json({ success: true, message: "Logo updated successfully", data: updatedPartner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ଡିଲିଟ୍ କରିବା ପାଇଁ
export const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPartner = await Partner.findByIdAndDelete(id);
        if (!deletedPartner) {
            return res.status(404).json({ success: false, message: "Partner not found" });
        }
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};