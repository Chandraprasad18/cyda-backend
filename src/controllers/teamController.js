import Team from '../models/Team.js';

// ସବୁ ଟିମ୍ ମେମ୍ବରଙ୍କୁ ଆଣିବା ପାଇଁ (GET)
export const getTeamMembers = async (req, res) => {
    try {
        const members = await Team.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: members.length, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ନୂଆ ମେମ୍ବର ଆଡ୍ କରିବା ପାଇଁ (POST)
export const addTeamMember = async (req, res) => {
    try {
        const { name, title, category, order } = req.body || {};

        if (!name || !title || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, title, and category' 
            });
        }

        let profileImage = '';
        // upload.any() ପାଇଁ req.files ବ୍ୟବହାର କରାଗଲା
        if (req.files && req.files.length > 0) {
            profileImage = `/uploads/${req.files[0].filename}`;
        } else if (req.file) {
            profileImage = `/uploads/${req.file.filename}`;
        }

        const newMember = await Team.create({
            name,
            title,
            category,
            profileImage,
            order: order ? Number(order) : 0
        });

        res.status(201).json({
            success: true,
            message: 'Team member added successfully',
            data: newMember
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to add team member', error: error.message });
    }
};

// ଟିମ୍ ମେମ୍ବରଙ୍କୁ ଅପଡେଟ୍ କରିବା ପାଇଁ (PUT)
export const updateTeamMember = async (req, res) => {
    try {
        const { name, title, category, order } = req.body;
        
        let member = await Team.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        let updateData = {
            name: name || member.name,
            title: title || member.title,
            category: category || member.category,
            order: order !== undefined ? Number(order) : member.order
        };

        // ଯଦି ଏଡିଟ୍ କରିବା ସମୟରେ ନୂଆ ଫଟୋ ଅପ୍ଲୋଡ୍ କରାଯାଇଥାଏ
        if (req.files && req.files.length > 0) {
            updateData.profileImage = `/uploads/${req.files[0].filename}`;
        } else if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        } else {
            updateData.profileImage = member.profileImage;
        }

        member = await Team.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Team member updated successfully',
            data: member
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update team member', error: error.message });
    }
};

// ମେମ୍ବର ଡିଲିଟ୍ କରିବା ପାଇଁ (DELETE)
export const deleteTeamMember = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        await member.deleteOne();
        res.status(200).json({ success: true, message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};