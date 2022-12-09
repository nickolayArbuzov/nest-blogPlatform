import * as nodemailer from "nodemailer";

export const sendEmail = async (email: string, code: string, action: string) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCAUNT,
      pass: process.env.GMAIL_PASSWORD,
    }
  })

  const emailTemplate = (code: string) => `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href='https://somesite.com/${action}=${code}'>complete registration</a>
     </p>`
 
  await transporter.sendMail({
    from: process.env.GMAIL_ACCAUNT,
    to: email,
    html: emailTemplate(code),
    subject: 'Registration vercel',
  })

}