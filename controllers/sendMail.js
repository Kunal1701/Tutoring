import nodemailer from "nodemailer";
import myDB from "../db/myDB.js";

const sendMail = async (req, res) => {
  let { email } = req.query;
  let user_id = req.session.passport.user;
  const userDetails = await myDB.getUsersById(user_id);
  const { fName, lName } = userDetails.profile;
  const emails = userDetails.profile.email;
  const lastSchedule = userDetails.schedule[userDetails.schedule.length - 1];
  const { date, time, subject } = lastSchedule;

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
    from: '"Where Is Your Tutor" <rashmithakur2202@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Booked Slot", // Subject line
    text: "Booked Slot  ", // plain text body
    html: `<b>Dear Tutor,</b>
    <br>
    <p>We are pleased to inform you that a slot has been booked by a student for tutoring. Below are the details:</p>
    <ul>
      <li><b>Student Name:</b> ${fName} ${lName}</li>
      <li><b>Student Email:</b> ${emails}</li>
      <li><b>Date:</b> ${date}</li>
      <li><b>Time:</b> ${time}</li>
      <li><b>Subject:</b> ${subject}</li>
    </ul>
    <p>Please be prepared for the session accordingly.</p>
    <p>Best regards,</p>
    <p>Where Is Your Tutor</p>
    `,
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
};

//module.exports = sendMail;
export default sendMail;
