import { Request, Response } from 'express';
import { getPool } from '../config/database';
import { generateOTP, sendEmail } from '../services/email.service';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const pool = getPool();

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this email
    await pool.query('DELETE FROM otps WHERE email = ?', [email]);

    // Store new OTP
    const otpId = randomUUID();
    await pool.query(
      'INSERT INTO otps (id, email, otp, expires_at) VALUES (?, ?, ?, ?)',
      [otpId, email, otp, expiresAt]
    );

    // Send email
    await sendEmail(
      email,
      'Your Foodzy OTP',
      `Your OTP for Foodzy is: ${otp}. This OTP will expire in 10 minutes.`
    );

    res.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const pool = getPool();

    // Find valid OTP
    const [otps] = await pool.query(
      'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [email, otp]
    );

    const otpRecords = otps as any[];

    if (otpRecords.length === 0) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Delete used OTP
    await pool.query('DELETE FROM otps WHERE email = ?', [email]);

    // Find or create user
    let [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = (users as any[])[0];

    if (!user) {
      const userId = randomUUID();
      await pool.query(
        'INSERT INTO users (id, email) VALUES (?, ?)',
        [userId, email]
      );
      [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      user = (users as any[])[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};

