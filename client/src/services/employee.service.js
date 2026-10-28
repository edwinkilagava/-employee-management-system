import { apiRequest } from "./api.js";
const EMPLOYEES_ENDPOINT = "/admin/employees";

/**
 * Validate a MongoDB employee ID.
 */
const validateEmployeeId = (employeeId) => {
  if (
    typeof employeeId !== "string" ||
    !/^[a-f\d]{24}$/i.test(employeeId)
  ) {
    throw new Error("A valid employee ID is required.");
  }
};

/**
 * Validate employee data before sending it to the backend.
 */
const validateEmployeeData = (employeeData) => {
  if (
    !employeeData ||
    typeof employeeData !== "object" ||
    Array.isArray(employeeData)
  ) {
    throw new Error("Valid employee details are required.");
  }
};

/**
 * Get all employees.
 */
export const getEmployees = async ({ signal } = {}) => {
  return apiRequest(EMPLOYEES_ENDPOINT, {
    method: "GET",
    signal,
  });
};

/**
 * Get one employee by ID.
 */
export const getEmployeeById = async (
  employeeId,
  { signal } = {}
) => {
  validateEmployeeId(employeeId);

  return apiRequest(
    `${EMPLOYEES_ENDPOINT}/${employeeId}`,
    {
      method: "GET",
      signal,
    }
  );
};

/**
 * Create an employee and initiate
 * the invitation workflow.
 *
 * employeeData can contain:
 *
 * Personal information:
 * - name
 * - nationalId
 * - dateOfBirth
 * - gender
 * - phone
 * - email
 *
 * Employment information:
 * - employeeId
 * - department
 * - jobTitle
 * - employmentType
 * - dateOfJoining
 * - salary
 *
 * Contact information:
 * - address
 * - city
 * - emergencyContactName
 * - emergencyContactPhone
 * - emergencyContactRelationship
 */
export const createEmployee = async (
  employeeData,
  { signal } = {}
) => {
  validateEmployeeData(employeeData);

  return apiRequest(EMPLOYEES_ENDPOINT, {
    method: "POST",
    body: employeeData,
    signal,
  });
};

/**
 * Update an employee as an administrator.
 */
export const updateEmployee = async (
  employeeId,
  employeeData,
  { signal } = {}
) => {
  validateEmployeeId(employeeId);
  validateEmployeeData(employeeData);

  return apiRequest(
    `${EMPLOYEES_ENDPOINT}/${employeeId}`,
    {
      method: "PATCH",
      body: employeeData,
      signal,
    }
  );
};

/**
 * Deactivate an employee.
 *
 * Backend route:
 * DELETE /api/admin/employees/:employeeId
 */
export const deactivateEmployee = async (
  employeeId,
  { signal } = {}
) => {
  validateEmployeeId(employeeId);

  return apiRequest(
    `${EMPLOYEES_ENDPOINT}/${employeeId}`,
    {
      method: "DELETE",
      signal,
    }
  );
};

/**
 * Reactivate an employee.
 *
 * Backend route:
 * PATCH /api/admin/employees/:employeeId/reactivate
 */
export const reactivateEmployee = async (
  employeeId,
  { signal } = {}
) => {
  validateEmployeeId(employeeId);

  return apiRequest(
    `${EMPLOYEES_ENDPOINT}/${employeeId}/reactivate`,
    {
      method: "PATCH",
      signal,
    }
  );
};

/**
 * Suspend an employee.
 *
 * Backend route:
 * PATCH /api/admin/employees/:employeeId/suspend
 */
export const suspendEmployee = async (
  employeeId,
  { signal } = {}
) => {
  validateEmployeeId(employeeId);

  return apiRequest(
    `${EMPLOYEES_ENDPOINT}/${employeeId}/suspend`,
    {
      method: "PATCH",
      signal,
    }
  );
};

/**
 * Resend an employee invitation.
 */
export const resendEmployeeInvitation = async (
  employeeId,
  { signal } = {}
) => {
  validateEmployeeId(employeeId);

  return apiRequest(
    `${EMPLOYEES_ENDPOINT}/${employeeId}/resend-invitation`,
    {
      method: "POST",
      signal,
    }
  );
};

/**
 * Update the currently logged-in employee's profile.
 *
 * Backend route:
 * PATCH /api/employee-self/me
 */
export const updateMyProfile = async (
  profileData,
  { signal } = {}
) => {
  validateEmployeeData(profileData);

  return apiRequest("/employee-self/me", {
    method: "PATCH",
    body: profileData,
    signal,
  });
};

/**
 * Upload a profile photo for the
 * currently logged-in employee.
 *
 * Backend route:
 * POST /api/employee-self/me/profile-image
 */
export const uploadMyProfileImage = async (
  file,
  { signal } = {}
) => {
  if (!(file instanceof File)) {
    throw new Error("Please select a photo first.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Please select a JPG, PNG, or WebP image."
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "The photo must be 5 MB or smaller."
    );
  }

  const formData = new FormData();

  // This name must match:
  // profileImageUpload.single("profileImage")
  // in the backend.
  formData.append("profileImage", file);

  return apiRequest(
    "/employee-self/me/profile-image",
    {
      method: "POST",
      body: formData,
      signal,
    }
  );
};