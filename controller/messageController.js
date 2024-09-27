const Message = require('../model/messageModel');
const nodemailer = require('nodemailer');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../middlewares/errorHandler');

exports.sendMessage = catchAsyncError(async (req, res, next) => {
    const { email, name, subject, message } = req.body;

    if (!email || !name || !subject || !message) {
        return next(new ErrorHandler('Please fill every field', 400));
    }

    try {
        const userMessage = await Message.create({
            name,
            email,
            subject,
            message,
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });


        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: 'lenoratest@gmail.com', 
            subject: `New Message from ${name}`,
            html: `
                <h3>You've received a new message!</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Message sent successfully!",
            userMessage,
        });
    } catch (error) {
        next(error);
    }
});
