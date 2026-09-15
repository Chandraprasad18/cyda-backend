import BePartner from '../models/bepartnermodels.js';
import nodemailer from 'nodemailer';

export const submitPartnerForm = async (req, res, next) => {
    try {
        const { 
            fullName, 
            contactPerson, 
            email, 
            phone, 
            address, 
            financialSupport, 
            inKindSupport, 
            csr, 
            other, 
            otherText 
        } = req.body;

        // 1. Database re save kariba
        const newPartner = new BePartner({
            fullName,
            contactPerson,
            email,
            phone,
            address,
            financialSupport,
            inKindSupport,
            csr,
            other,
            otherText
        });
        await newPartner.save();

        // 2. Admin mail ku notification pathiba (Nodemailer setup like contact form)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        transporter.verify((error) => {
            if (error) {
                console.error('SMTP Connection Failed:', error.message);
            } else {
                console.log('✅ Server is ready to send partnership emails!');
            }
        });

        const mailOptions = {
            from: 'chandraprasaddas18@gmail.com',
            to: 'yuvraj.cyda@gmail.com', // Admin email receive kariba
            subject: 'New Partnership Application - CYDA',
            html: `
                <h3>New Partnership Details Received:</h3>
                <p><b>Full Name / Organization:</b> ${fullName}</p>
                <p><b>Contact Person:</b> ${contactPerson || 'N/A'}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Address:</b> ${address || 'N/A'}</p>
                <h4>Type of Support Requested:</h4>
                <ul>
                    ${financialSupport ? '<li>Financial Support</li>' : ''}
                    ${inKindSupport ? '<li>In-kind Support</li>' : ''}
                    ${csr ? '<li>Corporate Social Responsibility (CSR)</li>' : ''}
                    ${other ? `<li>Other: ${otherText}</li>` : ''}
                </ul>
                <p>Submitted successfully on your website platform.</p>
            `
        };

        // Mail send kariba
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email to admin:", error);
            } else {
                console.log("Email sent to admin: " + info.response);
            }
        });

        res.status(201).json({
            success: true,
            message: "Partnership application submitted successfully, saved to database, and email sent to admin!",
            data: newPartner
        });

    } catch (error) {
        next(error);
    }
};

// Admin panel re sabu partner submissions fetch kariba pain
export const getAllPartners = async (req, res, next) => {
    try {
        const partners = await BePartner.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: partners
        });
    } catch (error) {
        next(error);
    }
};