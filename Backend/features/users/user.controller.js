
import * as userService from "./user.service.js";

const handleError = (res, error) => {
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Internal server error",
  });
};

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(
      req.query.page,
      req.query.limit
    );

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const requestedId = Number(req.params.id);
    const loggedInId = Number(req.user.id);

    // Users can view their own profile.
    // Admins can view any profile.
    if (
      loggedInId !== requestedId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this user",
      });
    }

    const user = await userService.getUserById(requestedId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/users/:id
export const updateUserProfile = async (req, res) => {
  try {
    const requestedId = Number(req.params.id);
    const loggedInId = Number(req.user.id);

    // Users can update their own profile.
    // Admins can update any profile.
    if (
      loggedInId !== requestedId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this user",
      });
    }

    const user = await userService.updateUserProfile(
      requestedId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// PATCH /api/users/:id/status
export const changeUserStatus = async (req, res) => {
  try {
    const user = await userService.changeUserStatus(
      Number(req.params.id),
      req.body.is_active
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    handleError(res, error);
  }
};
