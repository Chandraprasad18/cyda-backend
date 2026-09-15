import BeIntern from '../models/BeInternModel.js';
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

// Submit Intern Form
export const submitInternForm = async (req, res, next) => {
    try {
        const { fullName, ageOrDob, collegeName, email, phone, address } = req.body;

        if (!fullName || !ageOrDob || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
        }

        // Format names and text fields with proper capitalization
        const formattedFullName = capitalizeWords(fullName);
        const formattedCollegeName = capitalizeWords(collegeName);
        const formattedAddress = capitalizeWords(address);

        // 1. Save to Database with formatted capitalized fields
        const newIntern = new BeIntern({
            fullName: formattedFullName,
            ageOrDob,
            collegeName: formattedCollegeName,
            email,
            phone,
            address: formattedAddress
        });

        await newIntern.save();

        // 2. Admin mail ku notification pathiba
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || process.env.EMAIL_USER,
                pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
            }
        });

        transporter.verify((error) => {
            if (error) {
                console.error('SMTP Connection Failed:', error.message);
            } else {
                console.log('✅ Server is ready to send intern emails!');
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER || process.env.EMAIL_USER,
            to: 'yuvraj.cyda@gmail.com', // Admin email
            subject: 'New Internship Application - CYDA',
            html: `
                <h3>New Internship Details Received:</h3>
                <p><b>Full Name:</b> ${formattedFullName}</p>
                <p><b>Age/DOB:</b> ${ageOrDob}</p>
                <p><b>College Name:</b> ${formattedCollegeName || 'N/A'}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Address:</b> ${formattedAddress || 'N/A'}</p>
                <p>Submitted successfully on your website platform.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email to admin:", error);
            } else {
                console.log("Email sent to admin: " + info.response);
            }
        });

        res.status(201).json({
            success: true,
            message: "Intern application submitted successfully, saved to database, and email sent to admin!",
            data: newIntern
        });

    } catch (error) {
        next(error);
    }
};

// Get All Interns for Admin Panel
export const getAllInterns = async (req, res, next) => {
    try {
        const interns = await BeIntern.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: interns
        });
    } catch (error) {
        next(error);
    }
};