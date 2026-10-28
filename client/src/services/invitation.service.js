
import { apiRequest } from "./api.js";

export async function acceptInvitation(token, password) {
  if (!token) {
    throw new Error("The invitation link is missing its token.");
  }

  return apiRequest(
    `/invitations/${encodeURIComponent(token)}/accept`,
    {
      method: "POST",
      body: { password },
      auth: false,
    }
  );
}
