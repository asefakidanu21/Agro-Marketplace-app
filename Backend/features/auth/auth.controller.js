
import * as authService from "./auth.service.js";

const handleError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Internal server error",
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
