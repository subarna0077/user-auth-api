const nodemailer = require('nodemailer');

async function sendEmailConfirmation(email){
    const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
       }     
    });

   const message = `
   <p>
   SSS
    </p>
    <p> Please verify your email by the link below:</p>
    <a>Verify Email</a>
    <p>This link expires in 15 minutes.</p>
   `
   try {
    await transporter.sendMail({
        from: `"Testing" <${process.env.EMAIL_USER}>,`,
        to: email,
        subject: 'Verify the mail',
        html: message
    })
   }
   catch(error){
    console.error('Email sent failed', error.message)
   }
}

module.exports = sendEmailConfirmation;