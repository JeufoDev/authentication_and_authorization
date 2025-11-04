import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto'
import { users } from '../data/dataBase'
import type { User } from '../data/dataBase'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const register = async (request: Request, response: Response) => {
    try {
        const { user, password } = request.body;
        const existingUser = users.find(u => u.user === user);

        if (!user?.trim() || !password?.trim()) {
            return response.status(400).json({ "message": "Missing username or password" })
        } else if (existingUser) {
            return response.status(409).json({ "message": "Username is already in use" })
        }

        const passHash = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: randomUUID(),
            user,
            password: passHash
        }

        users.push(newUser);
        response.status(201).json({ "message": "Ceated" })

    } catch (error) {
        response.status(500).json({ error: "Internal server error." });
    }
}

const login = async (request: Request, response: Response) => {
    try {
        const { user, password } = request.body;

        if (!user?.trim() || !password?.trim()) {
            return response.status(400).json({ "message": "Invalid credentials" })
        }

        const existingUser = users.find(u => u.user === user);
        if (!existingUser) return response.status(401).json({ message: "Invalid credentials" });

        const isPassword = await bcrypt.compare(password, existingUser.password);
        if (!isPassword) return response.status(401).json({ message: "Invalid credentials" });

        const payload = {
            id: existingUser.id,
            user: existingUser.user
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