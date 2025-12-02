import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto'
import type { User, ExistingUserCheck } from '../types/types'
import { AuthRepository } from "../repositories/authRepository";
import jwt from 'jsonwebtoken'
import z from 'zod'
import 'dotenv/config'

const register = async (request: Request, response: Response) => {
    try {
        const { username, email, password } = request.body;

        const schema = z.object({
            username: z.string().min(8),
            email: z.email(),
            password: z.string().min(8).max(30)
        })

        const result = schema.safeParse({ username, email, password })

        if (!result.success) {
            return response.status(400).json({
                "message": "Validation error",
                "errors": [
                    { "field": "username", "message": "Must be at least 8 characters" },
                    { "field": "email", "message": "Invalid email format" },
                    { "field": "password", "message": "Must be at least 8 characters"}
                ]
            })
        }
        // if (!username?.trim() || !email?.trim() || !password?.trim()) {
        //     return response.status(400).json({ "message": "Missing username or password" })
        // }

        const authRepository = new AuthRepository();
        const existingUser: ExistingUserCheck = await authRepository.verifyExistUser(username, email);

        if (existingUser.usernameExists) {
            return response.status(409).json({ "message": "Username already exists" })
        }

        if (existingUser.emailExists) {
            return response.status(409).json({ "message": "Email already exists" })
        }

        const passHash = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: randomUUID(),
            username,
            email,
            role: 'user',
            password: passHash,
        }

        await authRepository.createUser(newUser);
        response.status(201).json({ "message": "Ceated" })

    } catch (error) {
        response.status(500).json({ error: "Internal server error." });
    }
}

const login = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body;

        if (!username?.trim() || !password?.trim()) {
            return response.status(401).json({ "message": "Invalid credentials" })
        }

        const authRepository = new AuthRepository();
        const existingUser = await authRepository.getuserByUsername(username);
        if (!existingUser) return response.status(401).json({ message: "Invalid credentials" });

        const isPassword = await bcrypt.compare(password, existingUser.password);
        if (!isPassword) return response.status(401).json({ message: "Invalid credentials" });

        const payload = {
            id: existingUser.id,
            user: existingUser.username,
            role: existingUser.role
        }

        if (!process.env.JWT_KEY) {
            throw new Error("JWT_KEY não definida");
        }

        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' })

        response.status(200).json({
            message: "Login successful",
            user: payload,
            token,
            expiresIn: '1h'
        })
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal server error." });
    }
}

export { register, login };