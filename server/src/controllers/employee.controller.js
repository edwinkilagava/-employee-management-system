
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  reactivateEmployee,
  suspendEmployee,
  updateMyProfile,
  resendEmployeeInvitation,
} from "../services/employee.service.js";

import cloudinary from "../config/cloudinary.js";

// Create a new employee
// Create a new employee
export const createEmployeeController = async (req, res, next) => {
  try {
    const {
      name,
      email,
      nationalId,
      dateOfBirth,
      gender,
      phone,
      employeeId,
      department,
      jobTitle,
      employmentType,
      dateOfJoining,
      salary,
      address,
      city,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    } = req.body;

    const result = await createEmployee({
      name,
      email,
      nationalId,
      dateOfBirth,
      gender,
      phone,
      employeeId,
      department,
      jobTitle,
      employmentType,
      dateOfJoining,
      salary,
      address,
      city,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all employees
export const getEmployeesController = async (req, res, next) => {
  try {
    const employees = await getEmployees();

    return res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// Get one employee
export const getEmployeeByIdController = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const employee = await getEmployeeById(employeeId);

    return res.status(200).json({
      success: true,
      message: "Employee retrieved successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Update an employee
export const updateEmployeeController = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const employee = await updateEmployee(employeeId, req.body);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate an employee
export const deactivateEmployeeController = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const employee = await deactivateEmployee(employeeId);

    return res.status(200).json({
      success: true,
      message: "Employee deactivated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Reactivate an employee
export const reactivateEmployeeController = async (req, res, next) => {
  try {
    const employee = await reactivateEmployee(req.params.employeeId);

    return res.status(200).json({
      success: true,
      message: "Employee reactivated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Suspend an employee
export const suspendEmployeeController = async (req, res, next) => {
  try {
    const employee = await suspendEmployee(req.params.employeeId);

    return res.status(200).json({
      success: true,
      message: "Employee suspended successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Update the logged-in employee's profile details
export const updateMyProfileController = async (req, res, next) => {
  try {
    const user = await updateMyProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Upload and save the logged-in employee's profile photo
export const uploadMyProfileImageController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload.",
      });
    }

    const imageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ems/profile-images",
          resource_type: "image",
          transformation: [
            {
              width: 500,
              height: 500,
              crop: "limit",
            },
          ],
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result?.secure_url) {
            return reject(
              new Error("The image upload did not return a URL.")
            );
          }

          resolve(result.secure_url);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Save the Cloudinary URL to this employee's own profile
    const user = await updateMyProfile(req.user.id, {
      profileImage: imageUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Resend an employee invitation
export const resendEmployeeInvitationController = async (
  req,
  res,
  next
) => {
  try {
    const { employeeId } = req.params;
    const result = await resendEmployeeInvitation(employeeId);

    return res.status(200).json({
      success: true,
      message: "Invitation email sent successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};