import express from 'express';
import multer from 'multer';
import { submitVendorOnboarding, getAllVendors } from '../controllers/vendorController.js';

const router = express.Router();

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All document upload fields matching frontend input names
const documentUploads = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'panCardFile', maxCount: 1 },
    { name: 'gstCertificateFile', maxCount: 1 },
    { name: 'registrationCertificateFile', maxCount: 1 },
    { name: 'msmeCertificateFile', maxCount: 1 },
    { name: 'cancelledChequeFile', maxCount: 1 },
    { name: 'organizationProfileFile', maxCount: 1 },
    { name: 'authorizedSignatoryIdFile', maxCount: 1 }
]);

// POST route for submitting the onboarding form
router.post('/vendor-onboarding', documentUploads, submitVendorOnboarding);

// GET route for fetching all vendors into the admin panel dashboard
router.get('/vendor-onboarding/all', getAllVendors);

export default router;