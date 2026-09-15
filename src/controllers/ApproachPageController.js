import ApproachPageModel from "../models/ApproachPageModel.js";

// GET ALL DATA
export const getApproachData = async (req, res, next) => {
    try {
        const data = await ApproachPageModel.find().sort({ orderIndex: 1 });
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        next(error);
    }
};

// SAVE DATA WITH FILE UPLOAD (MULTER)
export const saveApproachData = async (req, res, next) => {
    try {
        const { heading, boldContent, paragraph, orderIndex } = req.body;
        
        // Jodi user laptop ru image upload karibe, tahele req.file asiba
        let imageUrl = '';
        if (req.file) {
            // Apananka uploads folder ba static path hisab re file path set heijiba
            imageUrl = `/uploads/${req.file.filename}`; // ba req.file.path depending on your multer config
        }

        const newData = new ApproachPageModel({
            heading,
            imageUrl, // Uploaded file ra path eithi save heijiba
            boldContent,
            paragraph,
            orderIndex: orderIndex || 0
        });

        await newData.save();
        res.status(201).json({
            success: true,
            message: "Data and image saved successfully!",
            data: newData
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE DATA WITH FILE UPLOAD
export const updateApproachData = async (req, res, next) => {
    try {
        const { heading, boldContent, paragraph, orderIndex } = req.body;
        
        let updateData = { heading, boldContent, paragraph, orderIndex };
        
        // Jodi nua file upload karibe, keval seiti image update heiba
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedData = await ApproachPageModel.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Data not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Data updated successfully!",
            data: updatedData
        });
    } catch (error) {
        next(error);
    }
};

// DELETE DATA
export const deleteApproachData = async (req, res, next) => {
    try {
        await ApproachPageModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        next(error);
    }
};