import express from 'express';
import Footer from '../models/footerModel.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 1. GET: Fetch Footer Data
router.get('/', async (req, res) => {
  try {
    let footerData = await Footer.findOne();
    if (!footerData) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data: footerData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST / PUT: Create or Update Footer Data (Supports Create New)
const handleFooterSave = async (req, res) => {
  try {
    const {
      address, phone, email,
      bankName, accountHolder, accountNo, ifscCode, branch, micrCode,
      copyrightText,
      instagram, facebook, linkedin, twitter, youtube
    } = req.body;

    let updateData = {
      address,
      contact: { phone, email },
      socialLinks: { instagram, facebook, linkedin, twitter, youtube },
      bankDetails: { bankName, accountHolder, accountNo, ifscCode, branch, micrCode },
      copyrightText,
      images: {}
    };

    let footer = await Footer.findOne();
    if (footer && footer.images) {
      updateData.images.logoImage = footer.images.logoImage || '';
      updateData.images.footerImage = footer.images.footerImage || '';
    }

    if (req.files) {
      if (req.files.logoImage && req.files.logoImage[0]) {
        updateData.images.logoImage = `/uploads/${req.files.logoImage[0].filename}`;
      }
      if (req.files.footerImage && req.files.footerImage[0]) {
        updateData.images.footerImage = `/uploads/${req.files.footerImage[0].filename}`;
      }
    }

    // Upsert / Create or Update
    if (footer) {
      footer = await Footer.findOneAndUpdate({}, updateData, { new: true, runValidators: true });
    } else {
      footer = new Footer(updateData);
      await footer.save();
    }

    res.status(200).json({ success: true, message: "Footer Saved Successfully!", data: footer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

router.post('/', upload.fields([{ name: 'logoImage', maxCount: 1 }, { name: 'footerImage', maxCount: 1 }]), handleFooterSave);
router.put('/update', upload.fields([{ name: 'logoImage', maxCount: 1 }, { name: 'footerImage', maxCount: 1 }]), handleFooterSave);

// 3. DELETE: Footer Data Delete
router.delete('/', async (req, res) => {
  try {
    await Footer.deleteMany({});
    res.status(200).json({ success: true, message: "Footer data deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;