
import "dotenv/config";
import { sendInvitationEmail } from "./src/services/email.service.js";

try {
  const result = await sendInvitationEmail({
    to: "eddieanalo3@gmail.com",
    name: "Test Employee",
    invitationUrl: "http://localhost:5173/accept-invitation/test-token",
  });

  console.log("Email sent successfully:", result);
} catch (error) {
  console.error("Email test failed:", error.message);
}