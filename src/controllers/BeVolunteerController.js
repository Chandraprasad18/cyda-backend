import BeVolunteer from '../models/BeVolunteerModel.js';
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

// Submit Volunteer Form
export const submitVolunteerForm = async (req, res, next) => {
    try {
        const { fullName, ageOrDob, email, phone, address } = req.body;

        if (!fullName || !ageOrDob || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
        }

        // Format fullName and address so every word starts with a capital letter
        const formattedFullName = capitalizeWords(fullName);
        const formattedAddress = capitalizeWords(address);

        // 1. Save to Database with formatted capitalized names
        const newVolunteer = new BeVolunteer({
            fullName: formattedFullName,
            ageOrDob,
            email,
            phone,
            address: formattedAddress
        });

        await newVolunteer.save();

        // 2. Admin mail ku notification pathiba (Using SMTP_USER / SMTP_PASS setup)
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
                console.log('✅ Server is ready to send volunteer emails!');
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER || process.env.EMAIL_USER,
            to: 'yuvraj.cyda@gmail.com', // Admin email receive kariba
            subject: 'New Volunteer Application - CYDA',
            html: `
                <h3>New Volunteer Details Received:</h3>
                <p><b>Full Name:</b> ${formattedFullName}</p>
                <p><b>Age/DOB:</b> ${ageOrDob}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Address:</b> ${formattedAddress || 'N/A'}</p>
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
            message: "Volunteer application submitted successfully, saved to database, and email sent to admin!",
            data: newVolunteer
        });

    } catch (error) {
        next(error);
    }
};

// Get All Volunteers for Admin Panel
export const getAllVolunteers = async (req, res, next) => {
    try {
        const volunteers = await BeVolunteer.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: volunteers
        });
    } catch (error) {
        next(error);
    }
};