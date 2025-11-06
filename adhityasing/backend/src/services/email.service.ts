import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html: html || text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  to: string,
  orderId: string,
  order: any
): Promise<void> => {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #E03D30; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f4f4f4; padding: 10px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Foodzy - Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Thank you for your order! Your order has been confirmed and will be processed shortly.</p>
          
          <div class="order-details">
            <h2>Order #${orderId}</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">
              <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
              <p>Delivery Charges: $${order.delivery_charges.toFixed(2)}</p>
              <p>Total: $${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <p>We will send you another email when your order ships.</p>
          <p>Thank you for shopping with Foodzy!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(
    to,
    `Order Confirmation - #${orderId}`,
    `Your order #${orderId} has been confirmed. Total: $${order.total.toFixed(2)}`,
    html
  );
};

