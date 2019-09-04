import Nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = Nodemailer.createTransport({
      // host: process.env.HOST_MAIL,
      // port: process.env.PORT_MAIL,
      // secure: true,
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.PASSWORD_USER,
      },
    });
  }
  
  sendNewPassword({ to, subject = 'Solicitud de nueva contraseña', name, password }) {
    const mailOptions = {
      from: process.env.FROM_MAIL,
      to,
      subject,
      html: `<p>Hola ${name}, esta es tu nueva contraseña: <b>${password}</b></p>`,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            cano.log.error(error);
            reject(error);
        } else {
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', Nodemailer.getTestMessageUrl(info));
          resolve(info);
        }
      });
    });
  }
}

export default EmailService;
