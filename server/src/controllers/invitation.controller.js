
import { acceptInvitation } from "../services/invitation.service.js";

export const acceptInvitationController = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await acceptInvitation(token, password);

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};