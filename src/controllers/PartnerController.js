import Partner from '../models/PartnerModel.js';

// ସବୁ ପାର୍ଟନର ଡାଟା ଆଣିବା ପାଇଁ
export const getPartners = async (req, res) => {
    try {
        const data = await Partner.find();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ନୂଆ ପାର୍ଟନର ଲୋଗୋ ଆଡ୍ କରିବା ପାଇଁ
export const createPartner = async (req, res) => {
    try {
        let logoPath = '';
        if (req.file) {
            logoPath = `/uploads/${req.file.filename}`;
        }

        const newPartner = new Partner({ logo: logoPath });
        await newPartner.save();
        res.status(201).json({ success: true, message: "Partner added successfully", data: newPartner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ପାର୍ଟନର ଅପଡେଟ୍ କରିବା ପାଇଁ
export const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = {};

        if (req.file) {
            updateData.logo = `/uploads/${req.file.filename}`;
        }

        const updatedPartner = await Partner.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPartner) {
            return res.status(404).json({ success: false, message: "Partner not found" });
        }

        res.status(200).json({ success: true, message: "Updated successfully", data: updatedPartner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ପାର୍ଟନର ଡିଲିଟ୍ କରିବା ପାଇଁ
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