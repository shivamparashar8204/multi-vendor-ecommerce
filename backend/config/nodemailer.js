import nodemailer from "nodemailer";

function isDevEmailMode() {
  const user = process.env.SMTP_USER || "";
  return !user || user.includes("YOUR") || user.includes("example.com");
}

const devTransporter = {
  sendMail: async mailOptions => {
    const linkMatch = mailOptions.html?.match(/href="([^"]+)"/);
    console.log("\n========== DEV EMAIL (not sent) ==========");
    console.log("To:", mailOptions.to);
    console.log("Subject:", mailOptions.subject);
    if (linkMatch) {
      console.log("Activation link:", linkMatch[1]);
    }
    console.log("==========================================\n");
    return { messageId: "dev-mode" };
  },
};

const transporter = isDevEmailMode()
  ? devTransporter
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

export default transporter;
