import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Remplacez par votre hôte SMTP
  port: 587, // ou 465 pour SSL
  secure: false, // true pour port 465, false pour les autres ports
  auth: {
    user: process.env.USER_MAIL, // Votre adresse email
    pass: process.env.USER_PASSWORD_MAIL // Votre mot de passe
  }
});

export const sendEmail = async ({to, subject, text}:{to:string, subject:string, text:string}) => {
    console.log('====================================');
    console.log("GMAIL",process.env.USER_MAIL!);
    console.log('====================================');
  const mailOptions = {
    from: process.env.USER_MAIL!,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};