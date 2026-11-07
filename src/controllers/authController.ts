import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'MISSING_FIELDS',
                message: 'Email and password are required.'
            }
        });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials.'
            }
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials.'
            }
        });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
        success: true,
        data: userWithoutPassword
    });
};
