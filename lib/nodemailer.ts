import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Remplacez par votre hôte SMTP
  port: 587, // ou 465 pour SSL
  secure: false, // true pour port 465, false pour les autres ports
  auth: {
    user: process.env.USER_MAIL, // Votre adresse email
    pass: process.env.USER_PASSWORD_MAIL // Votre mot de passe
  }
});

export const sendEmail = async ({to, subject, html}:{to:string, subject:string, html:string}) => {
    console.log('====================================');
    console.log("GMAIL",process.env.USER_MAIL!);
    console.log('====================================');
  const mailOptions = {
    from: process.env.USER_MAIL!,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendEmails = async (users: any[], subject: string, html: string) => {
  const mailOptions = {
    from: process.env.USER_MAIL!,
    subject: subject,
    html,
  };

  for (const user of users) {
    if (user.status === 'activé') {
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: user.email,
        });
        console.log(`Email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    }
  }
}