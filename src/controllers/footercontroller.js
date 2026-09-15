import Footer from '../models/footerModel.js';

// 1. Get Footer Data
export const getFooterData = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      return res.status(200).json({ success: true, data: {} });
    }
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Update Footer Data
export const updateFooterData = async (req, res) => {
  try {
    const {
      address = '',
      phone = '',
      email = '',
      bankName = '',
      accountHolder = '',
      accountNo = '',
      ifscCode = '',
      branch = '',
      micrCode = '',
      copyrightText = '',
      instagram = '',
      facebook = '',
      linkedin = '',
      twitter = '',
      youtube = ''
    } = req.body || {};

    let existingFooter = await Footer.findOne();

    const updateData = {
      address,
      contact: { phone, email },
      socialLinks: {
        instagram: instagram || existingFooter?.socialLinks?.instagram || '',
        facebook: facebook || existingFooter?.socialLinks?.facebook || '',
        linkedin: linkedin || existingFooter?.socialLinks?.linkedin || '',
        twitter: twitter || existingFooter?.socialLinks?.twitter || '',
        youtube: youtube || existingFooter?.socialLinks?.youtube || ''
      },
      bankDetails: {
        bankName,
        accountHolder,
        accountNo,
        ifscCode,
        branch,
        micrCode
      },
      copyrightText,
      images: {
        logoImage: existingFooter?.images?.logoImage || '',
        footerImage: existingFooter?.images?.footerImage || ''
      }
    };

    // Handle Image Uploads
    if (req.files) {
      if (req.files.logoImage && req.files.logoImage[0]) {
        updateData.images.logoImage = `/uploads/${req.files.logoImage[0].filename}`;
      }
      if (req.files.footerImage && req.files.footerImage[0]) {
        updateData.images.footerImage = `/uploads/${req.files.footerImage[0].filename}`;
      }
    }

    const updatedFooter = await Footer.findOneAndUpdate(
      {}, 
      updateData, 
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Footer updated successfully!", 
      data: updatedFooter 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Delete Footer Data (Updated to handle both with ID or without ID)
export const deleteFooterData = async (req, res) => {
  try {
    let deletedFooter;
    
    // Jodi URL re ID asuthiba (e.g. /api/footer/:id)
    if (req.params && req.params.id) {
      deletedFooter = await Footer.findByIdAndDelete(req.params.id);
    } else {
      // Jodi URL re ID nathiiba, tahele first document ku delete karideba
      deletedFooter = await Footer.findOneAndDelete();
    }

    if (!deletedFooter) {
      return res.status(404).json({ success: false, message: "Footer data not found" });
    }
    
    res.status(200).json({ success: true, message: "Footer deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getFooterData,
  updateFooterData,
  deleteFooterData
};