import QRCode from "qrcode";
import { createTransporter, createTransporterForGmail } from "./emailConfig.js";

function generateAuthCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendAuthCodeEmail({ company, to }) {
    const authCode = generateAuthCode();

    try {
        // Generate QR code
        const qrBuffer = await QRCode.toBuffer(authCode, {
            type: "png",
            width: 100,
            margin: 1,
        });

        const transporter = createTransporter({
            host: company.co_smtpHost,
            email: company.co_smtpEmail,
            password: company.co_smtpPassword,
        });

        await transporter.sendMail({
            from: `"${company.co_name}" <${company.co_smtpEmail}>`,
            to,
            subject: "Your Auth Code with QR Code",
            html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hello,</p>
        <p>Your Auth Code is: <b>${authCode}</b></p>
        <p>Scan the QR code below:</p>
        <img src="cid:otpqr" alt="Auth Code QR Code" />
      </div>
    `,
            attachments: [
                {
                    filename: "authcode.png",
                    content: qrBuffer,
                    contentType: "image/png",
                    cid: "otpqr",
                },
            ],
        });

        return authCode; // return OTP so caller can store it
    } catch (err) {
        console.error("Failed to send AuthCode email:", err.message);
        // Still return OTP so it can be stored in DB
        return otp;
    }
}

export async function sendEmail({ host, email, password, fromName, to, subject, html, attachments = [] }) {
    try {
        const transporter = createTransporterForGmail({ host, email, password });

        console.log("host", host);
        console.log("email", email);
        console.log("password", password);

        await transporter.sendMail({
            from: `"${fromName}" <${email}>`,
            to,
            subject,
            html,
            attachments,
        });

        return true;
    } catch (err) {
        console.error("sendEmail error:", err);
        return false; // don’t throw, so controllers don’t break
    }
}