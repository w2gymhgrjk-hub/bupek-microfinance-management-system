import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthService } from '../services/authService';
import { HTTP_STATUS } from '../constants/errors';

const authService = new AuthService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login(email, password);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token required', HTTP_STATUS.BAD_REQUEST);
  }

  const { accessToken } = await authService.refreshToken(refreshToken);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken },
  });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: req.user,
  });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  await authService.changePassword(userId, oldPassword, newPassword);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Password changed successfully',
  });
});
