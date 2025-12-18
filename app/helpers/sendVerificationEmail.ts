import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);


export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?code=${verifyCode}`;

  try {
    const data = await resend.emails.send({
      from: "Mystery Message <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Welcome to Mystery Message 👋</h2>
          <p>Hi ${username},</p>
          <p>Click the button below to verify your email:</p>
          <a href="${confirmLink}"
             style="display:inline-block; background:#0070f3; color:#fff; padding:10px 20px; border-radius:5px; text-decoration:none;">
             Verify Email
          </a>
          <p>If the button doesn’t work, copy this link:</p>
          <p>${confirmLink}</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", data);

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
