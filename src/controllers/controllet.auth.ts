import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto'
import type { User } from '../types/types'
import { AuthRepository } from "../repositories/authRepository";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const register = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body;

        const authRepository = new AuthRepository();
        const existingUser: string = await authRepository.verifyUserByUsername(username);

        if (!username?.trim() || !password?.trim()) {
            return response.status(400).json({ "message": "Missing username or password" })
        } else if (existingUser) {
            return response.status(409).json({ "message": "Username is already in use" })
        }

        const passHash = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: randomUUID(),
            username,
            role: 'user',
            password: passHash,
        }

        authRepository.createUser(newUser);
        response.status(201).json({ "message": "Ceated" })

    } catch (error) {
        response.status(500).json({ error: "Internal server error." });
    }
}

const login = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body;

        if (!username?.trim() || !password?.trim()) {
            return response.status(400).json({ "message": "Invalid credentials" })
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