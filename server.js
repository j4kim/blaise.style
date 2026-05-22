const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Tous les champs sont requis." });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !contactEmail) {
    return res.status(500).json({
      success: false,
      message: "La configuration SMTP est manquante.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: smtpUser,
      to: contactEmail,
      replyTo: email,
      subject: `Nouveau message Blaise de ${name}`,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Nom :</strong> ${name}</p><p><strong>Email :</strong> ${email}</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    res.json({ success: true, message: "Message envoyé avec succès." });
  } catch (error) {
    console.error("SMTP Error:", error);
    res.status(500).json({
      success: false,
      message:
        "Impossible d’envoyer le message. Vérifiez la configuration SMTP.",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Serveur Blaise démarré sur http://localhost:${port}`);
});
