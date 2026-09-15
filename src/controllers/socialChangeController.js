import SocialChange from '../models/socialChangeModel.js';

// 1. GET: Social Change data fetch kariba
export const getSocialChangeData = async (req, res) => {
    try {
        let data = await SocialChange.findOne({});
        if (!data) {
            data = await SocialChange.create({
                title: "Youth4Change",
                firstHead: "Social Change",
                boldParaContent: "CYDA believes that meaningful and sustainable change is achievable",
                normalParagraph: "when stakeholders work collectively towards a common goal."
            });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. PUT: Admin panel ru Social Change data update kariba
export const updateSocialChangeData = async (req, res) => {
    try {
        const { title, firstHead, boldParaContent, normalParagraph } = req.body;
        let updateData = { title, firstHead, boldParaContent, normalParagraph };

        // Save only clean filename to avoid path duplication issues
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedData = await SocialChange.findOneAndUpdate(
            {}, 
            updateData, 
            { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Social Change content updated successfully!",
            data: updatedData
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};