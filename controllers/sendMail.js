import nodemailer from "nodemailer";

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();
  let email = req.query.email;

  // connect with the smtp
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    auth: {
      user: "rashmithakur2202@gmail.com",
      pass: "ogtr mbtv ngok jsoh",
    },
  });

  let info = await transporter.sendMail({
    from: '"Rashmi Thakur" <rashmithakur2202@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Booked Slot", // Subject line
    text: "Booked Slot  ", // plain text body
    html: "<b>Booked Slot for Tutoring</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
};

//module.exports = sendMail;
export default sendMail;
