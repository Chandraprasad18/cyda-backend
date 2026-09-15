import Story from '../models/StoryModel.js';

export const getStoriesBySection = async (req, res, next) => {
    try {
        const { sectionName } = req.params;
        
        // Regex use karigala jemti capital ba small letter (e.g. landingPage) re kichi error nahuaye
        const stories = await Story.find({ 
            section: { $regex: new RegExp(`^${sectionName}$`, "i") } 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: stories
        });
    } catch (error) {
        next(error);
    }
};

export const addStory = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ 
                success: false, 
                message: "Form data is missing!" 
            });
        }

        const { section, storyContent, link } = req.body;
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : '';

        if (!thumbnail) {
            return res.status(400).json({ success: false, message: "Thumbnail image is required!" });
        }

        const newStory = new Story({
            section: section || 'youth',
            storyContent,
            link: link || "https://cydaindia.org",
            thumbnail
        });

        await newStory.save();

        res.status(201).json({
            success: true,
            message: 'Story added successfully!',
            data: newStory
        });
    } catch (error) {
        next(error);
    }
};

export const updateStory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { section, storyContent, link } = req.body;

        const existingStory = await Story.findById(id);
        if (!existingStory) {
            return res.status(404).json({ success: false, message: "Story not found!" });
        }

        let updatedData = {
            section: section || existingStory.section,
            storyContent: storyContent || existingStory.storyContent,
            link: link || existingStory.link
        };

        if (req.file) {
            updatedData.thumbnail = `/uploads/${req.file.filename}`;
        }

        const updatedStory = await Story.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({
            success: true,
            message: 'Story updated successfully!',
            data: updatedStory
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Story.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Story deleted successfully!'
        });
    } catch (error) {
        next(error);
    }
};