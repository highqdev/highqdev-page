import { getSecret } from "astro:env/server";
import nodemailer from "nodemailer";

export const prerender = false;

export const POST = async ({ request }) => {
  const { name, lastName, phone, email, message } = await request.json();
  const EMAIL = getSecret("EMAIL");
  const PASSWORD_APP = getSecret("PASSWORD_APP");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD_APP,
    }
  })

  const CONTACT_INFORMATION = `
    INFORMACIÓN DE CONTACTO:
    - Teléfono: ${phone}
    - Email: ${email}\n
  `;
  const MESSAGE = `MENSAJE:\n${message}`

  const mailOptions = {
    from: email,
    to: "filetelopezchristian@gmail.com",
    subject: `${name} ${lastName} - Contacto`,
    text: `${CONTACT_INFORMATION}${MESSAGE}`,
  }

  try {
    await transporter.sendMail(mailOptions);
    return new Response("Contacto enviado exitosamente", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error al enviar el contacto", { status: 500 });
  }
}