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

const sendAccountCreationAlert = async (userName:string, userEmail:string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
      </div>
      <h1 style="text-align: center; color: #FF5733;">Nouvel utilisateur inscrit</h1>
      <p>Bonjour Admin,</p>
      <p>L'utilisateur <strong>${userName}</strong> vient de créer un compte sur notre application.</p>
      <p>Voici les informations de l'utilisateur :</p>
      <ul>
        <li>Nom : ${userName}</li>
        <li>Email : ${userEmail}</li>
      </ul>
      <p>Veuillez vérifier et approuver le compte si tout est en ordre.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://csv-election.vercel.app/admin/gestion-utilisateur" style="background-color: #FF5733; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Gérer les utilisateurs</a>
      </div>
    </div>
  `;

  await sendEmail({
    to: "admin.evote@gmail.com",
    subject: "Nouvel utilisateur inscrit",
    html: html,
  });
};


const sendNewApplicationAlert = async (candidateName:string, electionTitle:string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
      </div>
      <h1 style="text-align: center; color: #FF5733;">Nouvelle candidature reçue</h1>
      <p>Bonjour Admin,</p>
      <p>L'utilisateur <strong>${candidateName}</strong> vient de postuler pour l'élection <strong>${electionTitle}</strong>.</p>
      <p>Veuillez examiner la candidature et prendre les mesures nécessaires.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://csv-election.vercel.app/admin/gestion-candidat" style="background-color: #FF5733; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Gérer les candidatures</a>
      </div>
    </div>
  `;

  await sendEmail({
    to: "admin.evote@gmail.com",
    subject: "Nouvelle candidature reçue",
    html: html,
  });
};
