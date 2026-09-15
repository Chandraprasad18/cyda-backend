import HeroContact from "../models/heroconmodel.js";

// Get Contact Hero Data
export const getHeroContactData = async (req, res) => {
    try {
        let contactData = await HeroContact.findOne();
        if (!contactData) {
            contactData = await HeroContact.create({
                contactPageName: "CONTACT US",
                contactCoverImage: "./assets/Contact/ContactUsCoverImage.jpg"
            });
        }
        res.status(200).json({ success: true, data: contactData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Contact Hero Data (Admin Panel)
export const updateHeroContactData = async (req, res) => {
    try {
        const { contactPageName } = req.body;
        let updateData = {};

        if (contactPageName !== undefined) {
            updateData.contactPageName = contactPageName;
        }

        if (req.file) {
            updateData.contactCoverImage = req.file.filename; // Multer saves filename
        }

        let contactData = await HeroContact.findOne();
        if (contactData) {
            contactData = await HeroContact.findOneAndUpdate({}, updateData, { new: true });
        } else {
            contactData = await HeroContact.create(updateData);
        }

        res.status(200).json({ success: true, message: "Updated successfully", data: contactData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};