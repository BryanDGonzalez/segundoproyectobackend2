const nodemailer = require('nodemailer');

/**
 * Configuración de nodemailer para envío de correos
 */
class Mailer {
  constructor() {
    // Configuración del transporter
    // En desarrollo, puedes usar servicios como Ethereal Email o Gmail
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Enviar correo de recuperación de contraseña
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Ecommerce API" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperación de Contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">
            Este enlace es válido por 1 hora. Si no solicitaste este cambio, ignora este correo.
          </p>
          <p style="color: #666; font-size: 12px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            ${resetUrl}
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Correo enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      throw error;
    }
  }

  /**
   * Enviar correo genérico
   */
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: `"Ecommerce API" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      throw error;
    }
  }

  /**
   * Verificar conexión del transporter
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor de correo listo');
      return true;
    } catch (error) {
      console.error('❌ Error en servidor de correo:', error);
      return false;
    }
  }
}

module.exports = new Mailer();


