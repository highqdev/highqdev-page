export const prerender = false;

import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ← Cargar variables del .env manualmente

export const POST: APIRoute = async ({ request }) => {

  const formData = await request.formData();
  const name = formData.get("name")?.toString() || "Sin nombre";
  const lastname = formData.get("lastname")?.toString() || "Sin apellido";
  const email = formData.get("email")?.toString() || "Sin correo";
  const message = formData.get("message")?.toString() || "Sin mensaje";
  const phone = formData.get("phone")?.toString() || "Sin telefono";


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: import.meta.env.EMAIL_USERNAME,
      pass: import.meta.env.EMAIL_PASSWORD,
    },
  });
  
  

  try {
    await transporter.sendMail({
      from: `"Formulario Web" <${import.meta.env.EMAIL_USERNAME}>`,
      to: import.meta.env.EMAIL_USERNAME, // Tú mismo
      subject: "Nuevo mensaje de contacto",
      html: `
        <h2>Nuevo mensaje desde el formulario</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Apellido:</strong> ${lastname}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response("Mensaje enviado con éxito", { status: 200 });
  } catch (err) {
    console.error("Error al enviar el correo:", err);
    return new Response("Error al enviar el mensaje", { status: 500 });
  }
};
