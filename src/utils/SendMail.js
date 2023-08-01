import { json } from "express";
import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  try {
    // console.log(req);
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "darrick.jast45@ethereal.email",
        pass: "nmB6x11fHfw5Vcb9hc",
      },
    });

    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <leta.tillman39@ethereal.email>',
      to: req.to,
      subject: req.subject,
      html: req.html,
    });

    return;
    //return res.status(200);
  } catch (err) {
    console.log(err);
  }
};
