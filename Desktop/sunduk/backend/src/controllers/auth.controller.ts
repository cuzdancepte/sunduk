import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, nativeLanguageId, learningLanguageId } =
      req.body;

    // Validation
    if (!email || !password || !username || !nativeLanguageId || !learningLanguageId) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username,
        nativeLanguageId,
        learningLanguageId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        nativeLanguageId: true,
        learningLanguageId: true,
      },
    });

    // Create initial progress
    await prisma.userProgress.create({
      data: {
        userId: user.id,
      },
    });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    // Return more detailed error message in development
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Internal server error';
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        role: true,
        nativeLanguageId: true,
        learningLanguageId: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

