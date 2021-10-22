import nodemailer  from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            
            service: 'gmail',
           
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_ID,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};


