import Vendor from '../models/VendorModel.js';
import nodemailer from 'nodemailer';

// Helper function to capitalize each word (e.g., "rahul kumar das" -> "Rahul Kumar Das")
const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const submitVendorOnboarding = async (req, res, next) => {
    try {
        const rawData = req.body || {};
        const files = req.files || {};

        console.log('Received payload text fields:', rawData);
        console.log('Received file keys:', Object.keys(files));

        if (!rawData.legalBusinessName || !rawData.emailAddress) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        // Apply capitalization formatting to name, address, and text fields
        const data = {
            ...rawData,
            legalBusinessName: capitalizeWords(rawData.legalBusinessName),
            tradeName: capitalizeWords(rawData.tradeName),
            typeOfOrganization: capitalizeWords(rawData.typeOfOrganization),
            natureOfBusiness: capitalizeWords(rawData.natureOfBusiness),
            address: capitalizeWords(rawData.address),
            city: capitalizeWords(rawData.city),
            state: capitalizeWords(rawData.state),
            country: capitalizeWords(rawData.country || 'India'),
            primaryContactPerson: capitalizeWords(rawData.primaryContactPerson),
            designation: capitalizeWords(rawData.designation),
            alternateContactPerson: capitalizeWords(rawData.alternateContactPerson),
            accountHolderName: capitalizeWords(rawData.accountHolderName),
            bankName: capitalizeWords(rawData.bankName),
            branchName: capitalizeWords(rawData.branchName),
            descriptionOfProductsServices: rawData.descriptionOfProductsServices, // Keep description as is or capitalize if preferred
            ref1OrgName: capitalizeWords(rawData.ref1OrgName),
            ref1ContactPerson: capitalizeWords(rawData.ref1ContactPerson),
            ref2OrgName: capitalizeWords(rawData.ref2OrgName),
            ref2ContactPerson: capitalizeWords(rawData.ref2ContactPerson),
            signatoryName: capitalizeWords(rawData.signatoryName),
            signatoryDesignation: capitalizeWords(rawData.signatoryDesignation),
            signature: capitalizeWords(rawData.signature)
        };

        // 1. Save data to MongoDB Database
        const newVendor = new Vendor(data);
        await newVendor.save();

        // 2. Process file attachments for Nodemailer
        const attachments = [];
        Object.keys(files).forEach((fieldName) => {
            const fileArray = files[fieldName];
            if (fileArray && fileArray.length > 0) {
                const file = fileArray[0];
                attachments.push({
                    filename: `${fieldName}_${file.originalname}`,
                    content: file.buffer,
                });
            }
        });

        // 3. Email HTML Content Format
        const emailContent = `
            <h2>CYDA Vendor Onboarding Registration Details</h2>
            
            <h3>1. Vendor Details</h3>
            <p><b>Legal Business Name:</b> ${data.legalBusinessName}</p>
            <p><b>Trade Name:</b> ${data.tradeName || 'N/A'}</p>
            <p><b>Type of Organization:</b> ${data.typeOfOrganization}</p>
            <p><b>Year of Establishment:</b> ${data.yearOfEstablishment || 'N/A'}</p>
            <p><b>Nature of Business:</b> ${data.natureOfBusiness}</p>
            <p><b>Website:</b> ${data.website || 'N/A'}</p>

            <h3>2. Registered Office Address</h3>
            <p>${data.address}, ${data.city}, ${data.state} - ${data.pinCode}, ${data.country}</p>

            <h3>3. Contact Information</h3>
            <p><b>Primary Contact:</b> ${data.primaryContactPerson} (${data.designation})</p>
            <p><b>Mobile:</b> ${data.mobileNumber}</p>
            <p><b>Email:</b> ${data.emailAddress}</p>
            <p><b>Alternate Contact:</b> ${data.alternateContactPerson || 'N/A'} (${data.alternateEmail || 'N/A'})</p>

            <h3>4. Tax & Registration Information</h3>
            <p><b>PAN:</b> ${data.panNumber}</p>
            <p><b>GST:</b> ${data.gstNumber || 'N/A'}</p>
            <p><b>MSME / Udyam:</b> ${data.msmeRegistrationNumber || 'N/A'}</p>
            <p><b>CIN / Reg No:</b> ${data.companyRegistrationNumber || 'N/A'}</p>

            <h3>5. Banking Information</h3>
            <p><b>Account Holder:</b> ${data.accountHolderName}</p>
            <p><b>Bank & Branch:</b> ${data.bankName}, ${data.branchName}</p>
            <p><b>Account No:</b> ${data.accountNumber} (${data.accountType})</p>
            <p><b>IFSC:</b> ${data.ifscCode} | <b>SWIFT:</b> ${data.swiftCode || 'N/A'}</p>

            <h3>6. Goods / Services Offered</h3>
            <p>${data.descriptionOfProductsServices}</p>

            <h3>7. Business References</h3>
            <p><b>Ref 1:</b> ${data.ref1OrgName || 'N/A'} | ${data.ref1ContactPerson || ''} | ${data.ref1Phone || ''} | ${data.ref1Email || ''}</p>
            <p><b>Ref 2:</b> ${data.ref2OrgName || 'N/A'} | ${data.ref2ContactPerson || ''} | ${data.ref2Phone || ''} | ${data.ref2Email || ''}</p>

            <h3>8. Compliance Declaration</h3>
            <p>Legally Registered: <b>${data.legallyRegistered}</b></p>
            <p>Information Accurate: <b>${data.infoAccurate}</b></p>
            <p>Complies with Regulations: <b>${data.compliesWithRegulations}</b></p>
            <p>Not Blacklisted: <b>${data.notBlacklisted}</b></p>
            <p>Agrees to Policies: <b>${data.agreesToPolicies}</b></p>

            <h3>9. Attached Documents</h3>
            <p><b>Total Files Attached:</b> ${attachments.length}</p>

            <h3>10. Authorized Signatory</h3>
            <p><b>Name:</b> ${data.signatoryName}</p>
            <p><b>Designation:</b> ${data.signatoryDesignation}</p>
            <p><b>Signature:</b> ${data.signature}</p>
            <p><b>Date:</b> ${data.date}</p>
        `;

        // 4. Nodemailer Transporter Setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER || process.env.EMAIL_USER,
                pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER || process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || 'arpitwase@cydaindia.org',
            subject: `New Vendor Registration: ${data.legalBusinessName}`,
            html: emailContent,
            attachments: attachments,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email to admin:", error);
            } else {
                console.log("Email sent to admin: " + info.response);
            }
        });

        return res.status(201).json({
            success: true,
            message: "Vendor registration submitted successfully, saved to database, and email sent to admin!",
            data: newVendor
        });

    } catch (error) {
        next(error);
    }
};

// Get All Vendors for Admin Panel
export const getAllVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: vendors
        });
    } catch (error) {
        next(error);
    }
};