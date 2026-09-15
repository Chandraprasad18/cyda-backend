import ContactForm from '../models/contactformmodels.js';
import nodemailer from 'nodemailer';

// Helper function to capitalize names properly (e.g., "chandra prasad das" -> "Chandra Prasad Das")
const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const submitContactForm = async (req, res, next) => {
    try {
        let { name, phone, email, subject, message } = req.body;

        // Automatically format name to have capital letters for First, Middle, Last names
        name = capitalizeWords(name);

        // 1. Database re save kariba
        const newContact = new ContactForm({
            name,
            phone,
            email,
            subject: subject ? capitalizeWords(subject) : 'General Inquiry',
            message
        });
        await newContact.save();

        // 2. Admin mail ku notification pathiba (Nodemailer setup)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: 'chandraprasaddas18@gmail.com',
            to: 'yuvraj.cyda@gmail.com',      // Admin email receive kariba
            subject: 'New Contact Form Submission - CYDA',
            html: `
                <h3>New Contact Details Received:</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Subject:</b> ${newContact.subject}</p>
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
            message: "Contact form submitted, saved to database, and email sent to admin!",
            data: newContact
        });

    } catch (error) {
        next(error);
    }
};

// 3. Admin panel re sabu contact messages fetch kariba pain function
export const getAllContactForms = async (req, res, next) => {
    try {
        const contacts = await ContactForm.find().sort({ createdAt: -1 }); // Latest first show kariba
        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};