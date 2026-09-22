import HeroContact from "../models/heroconmodel.js";

export const getHeroContactData = async (req, res) => {
    try {
        let contactData = await HeroContact.find();
        if (!contactData || contactData.length === 0) {
            const defaultContact = await HeroContact.create({
                contactPageName: "CONTACT US",
                contactCoverImage: "./assets/Contact/ContactUsCoverImage.jpg"
            });
            contactData = [defaultContact];
        }
        res.status(200).json({ success: true, data: contactData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createHeroContactData = async (req, res) => {
    try {
        const { contactPageName } = req.body;
        let coverImage = "./assets/Contact/ContactUsCoverImage.jpg";

        if (req.file) {
            coverImage = req.file.filename;
        }

        const newContact = await HeroContact.create({
            contactPageName: contactPageName || "CONTACT US",
            contactCoverImage: coverImage
        });

        res.status(201).json({ success: true, message: "Added successfully", data: newContact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateHeroContactData = async (req, res) => {
    try {
        const { id } = req.params;
        const { contactPageName } = req.body;
        let updateData = {};

        if (contactPageName !== undefined) {
            updateData.contactPageName = contactPageName;
        }

        if (req.file) {
            updateData.contactCoverImage = req.file.filename; 
        }

        const updatedContact = await HeroContact.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedContact) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, message: "Updated successfully", data: updatedContact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteHeroContactData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await HeroContact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};