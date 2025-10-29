import express, { Request, Response } from 'express';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import 'dotenv/config'

const server = express();
server.use(helmet());
server.use(express.json());

server.post('/register', async (request: Request, response: Response) => {
    const { user, password } = request.body;

    try {
        if (!user || !password || user.trim() === "" || password.trim() === "") {
            return response.status(401).json({ "message": "Missing username or password" })
        }

        const passHash = await bcrypt.hash(password, 10);

        response.status(200).json({ "message": "Ceated" })

    } catch (error) {
        response.status(500).json({ error: "Internal server error." });
    }
});


const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server running in port: ${port}`)
})