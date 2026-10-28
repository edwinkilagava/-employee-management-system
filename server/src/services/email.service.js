import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvitationEmail = async ({
  to,
  name,
  invitationUrl,
}) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "You're invited to join our team",
    html: `
      <h2>Hello ${name},</h2>

      <p>
        You have been invited to join our Employee Management System.
      </p>

      <p>
        Click the button below to accept your invitation
        and set your password.
      </p>

      <p>
        <a href="${invitationUrl}">
          Accept Invitation
        </a>
      </p>

      <p>
        This invitation expires in 48 hours.
      </p>

      <p>
        If you were not expecting this invitation,
        you can safely ignore this email.
      </p>
    `,
  });

if (error) {
  console.error("Resend error:", error);
  throw new Error(error.message || "Failed to send invitation email");
}

  return data;
};