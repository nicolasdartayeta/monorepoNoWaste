import { db } from "@server/db/db";
import { mailSubscription, NewMailSubscription } from "../../db/schema";
import nodemailer from "nodemailer";

export async function addSubscription(mail: NewMailSubscription) {
  const result = await db.insert(mailSubscription).values(mail).returning();
  if (result) return true;
  return false;
}

export async function sendMailToAllSubscriptions(
  mail_data: string,
  subject: string,
) {
  try {
    // Crea el transporte de nodemailer (configura tu servicio de email)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Recupera los mails de la base de datos.
    const mails = await db.select().from(mailSubscription);

    // Se iteran y se envian de a uno.
    for (const index in mails) {
      const mail = mails[index].mail;
      const mailOptions = {
        from: `"NoWaste" <${process.env.EMAIL_USER}>`, // Remitente
        to: mail, // Destinatario (puedes usar un array de correos también)
        subject: subject, // Asunto
        html: mail_data, // El contenido HTML leído desde el archivo
        text: "test", // El contenido HTML leído desde el archivo
      };

      await transporter.sendMail(mailOptions);
    }

    //}
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}
