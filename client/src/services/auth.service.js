import { apiRequest, tokenStorage } from "./api.js";

export const loginUser = async ({ email, password }) => {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    auth: false,
    body: {
      email,
      password,
    },
  });

  const responseData = response.data;

  if (
    !responseData ||
    responseData.success !== true ||
    !responseData.data?.accessToken ||
    !responseData.data?.user
  ) {
    throw new Error(
      "The authentication server returned an invalid login response."
    );
  }

  const { accessToken, user } = responseData.data;

  tokenStorage.set(accessToken);

  return user;
};

export const getCurrentUser = async () => {
  const response = await apiRequest("/auth/me", {
    method: "GET",
  });

  const responseData = response.data;

  if (
    !responseData ||
    responseData.success !== true ||
    !responseData.data
  ) {
    throw new Error(
      "The authentication server returned an invalid user response."
    );
  }

  return responseData.data;
};

export const logoutUser = async () => {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    tokenStorage.remove();
  }
};