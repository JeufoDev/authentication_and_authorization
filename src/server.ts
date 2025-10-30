import express, { Request, Response } from 'express';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import 'dotenv/config'
import { users } from './data/dataBase'
import type { User } from './data/dataBase'

const server = express();
server.use(helmet());
server.use(express.json());

server.post('/register', async (request: Request, response: Response) => {
    const { user, password } = request.body;
    const existingUser = users.find(u => u.user === user);

    try {
        if (!user || !password || user.trim() === "" || password.trim() === "") {
            return response.status(400).json({ "message": "Missing username or password" })
        } else if (existingUser) {
            return response.status(409).json({ "message": "Username is already in use" })
        }

        const passHash = await bcrypt.hash(password, 10);

        const newUser: User = {
            user,
            password: passHash
        }

        users.push(newUser);
        response.status(201).json({ "message": "Ceated" })

    } catch (error) {
        response.status(500).json({ error: "Internal server error." });
    }
});


const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server running in port: ${port}`)
})