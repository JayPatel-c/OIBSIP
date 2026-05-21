const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  let transporter;

  const useSMTP = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (useSMTP) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'Pizza Shop'} <${process.env.FROM_EMAIL || 'no-reply@pizzashop.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  if (useSMTP) {
    try {
      const info = await transporter.sendMail(message);
      console.log(`Email message sent successfully: ${info.messageId}`);
      
      // Log Ethereal preview link if using Ethereal
      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`🔗 Preview Email in Ethereal App: ${previewUrl}`);
      }
      
      return info;
    } catch (err) {
      console.error(`Nodemailer Error: ${err.message}. Printed to console as fallback.`);
      
      // Fallback: Console printing on error
      console.log('\n======================================================');
      console.log(`✉️  EMAIL SENT TO (FALLBACK): ${options.email}`);
      console.log(`📌 SUBJECT: ${options.subject}`);
      console.log('------------------------------------------------------');
      console.log(options.message);
      console.log('======================================================\n');
      
      return { fallback: true };
    }
  } else {
    // Fallback: Console printing if no SMTP is configured
    console.log('\n======================================================');
    console.log(`✉️  EMAIL SENT TO (FALLBACK): ${options.email}`);
    console.log(`📌 SUBJECT: ${options.subject}`);
    console.log('------------------------------------------------------');
    console.log(options.message);
    console.log('======================================================\n');
    console.log('ℹ️  SMTP credentials are not configured or empty. Email printed to console.');
    return { fallback: true };
  }
};

module.exports = sendEmail;
