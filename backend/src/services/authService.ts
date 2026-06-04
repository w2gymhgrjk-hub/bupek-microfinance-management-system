import { query } from '../db/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { User, AuthPayload } from '../types';

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const result = await query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    if (!user.is_active) {
      throw new Error('User account is inactive');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      branch_id: user.branch_id,
    };

    const accessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    return { user, accessToken, refreshToken };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as AuthPayload;
      const accessToken = jwt.sign(decoded, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!passwordMatch) {
      throw new Error('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      hashedPassword,
      userId,
    ]);
  }

  async resetPassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      hashedPassword,
      userId,
    ]);
  }
}
