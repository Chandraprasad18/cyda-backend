import GetInvolved from '../models/getInvolvedModel.js';

// 1. GET: Fetch GetInvolved Data
export const getInvolvedData = async (req, res) => {
  try {
    let data = await GetInvolved.findOne().sort({ createdAt: -1 }); // ସବୁଠାରୁ ଶେଷରେ ତିଆରି ହୋଇଥିବା ଡାଟା ଆଣିବ
    if (!data) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. POST / PUT: Create or Update GetInvolved Data & Images
export const updateInvolvedData = async (req, res) => {
  try {
    const { heading, description, joinButtonText, quoteText } = req.body;

    let existingData = await GetInvolved.findOne().sort({ createdAt: -1 });

    let handshakeIconPath = existingData?.images?.handshakeIcon || '';
    let footerImagePath = existingData?.images?.footerImage || '';
    let unstoppableImagePath = existingData?.images?.unstoppableImage || '';

    if (req.files) {
      if (req.files.handshakeIcon && req.files.handshakeIcon[0]) {
        handshakeIconPath = `/uploads/${req.files.handshakeIcon[0].filename}`;
      }
      if (req.files.footerImage && req.files.footerImage[0]) {
        footerImagePath = `/uploads/${req.files.footerImage[0].filename}`;
      }
      if (req.files.unstoppableImage && req.files.unstoppableImage[0]) {
        unstoppableImagePath = `/uploads/${req.files.unstoppableImage[0].filename}`;
      }
    }

    const updateData = {
      heading,
      description,
      joinButtonText,
      quoteText,
      images: {
        handshakeIcon: handshakeIconPath,
        footerImage: footerImagePath,
        unstoppableImage: unstoppableImagePath
      }
    };

    let updatedRecord;
    // ଯଦି ଆପଣ ନୂଆ "Create New" କରିବାକୁ ଚାହୁଁଛନ୍ତି କିମ୍ବା ଏକାଧିକ ରଖିବାକୁ ଚାହୁଁଛନ୍ତି, ତେବେ ତଳର ଲଜିକ୍ କାମ କରିବ:
    // ଯଦି କେବଳ ଗୋଟିଏ ରେକର୍ଡ ଅପଡେଟ୍ ହେବ, ତେବେ findOneAndUpdate ବ୍ୟବହାର ହେବ।
    if (existingData) {
      updatedRecord = await GetInvolved.findByIdAndUpdate(
        existingData._id, 
        updateData, 
        { new: true, runValidators: true }
      );
    } else {
      updatedRecord = new GetInvolved(updateData);
      await updatedRecord.save();
    }

    res.status(200).json({ 
      success: true, 
      message: "GetInvolved Saved Successfully!", 
      data: updatedRecord 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};