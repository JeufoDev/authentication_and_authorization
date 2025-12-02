import database from '../config/configDatabase'
import { User } from '../types/types';

export class AuthRepository {

    public async createUser(user: User) {
        const query = `
        INSERT INTO users (id, username, email, role, password)
        VALUES ($1, $2, $3, $4, $5)
        returning *
        `;

        const values = [
            user.id,
            user.username,
            user.email,
            user.role,
            user.password
        ];

        const result = await database.query(query, values);
        return result.rows[0];
    }

    public async verifyExistUser(username: string, email: string) {
        const queryusername = `
        SELECT id 
        FROM users 
        WHERE username = $1
        LIMIT 1;
        `;

        const queryEmail = `
        SELECT id
        FROM users
        WHERE email = $1
        LIMIT 1
        `;

        const values = [
            username,
            email
        ];

        const [usernameResult, emailResult] = await Promise.all([
            database.query(queryusername, [username]),
            database.query(queryEmail, [email])
        ]);

        return {
            usernameExists: !!usernameResult.rows[0],
            emailExists: !!emailResult.rows[0]
        };
    }

    public async getuserByUsername(username: string) {
        const query = `
        SELECT id, username, role, password
        FROM users 
        WHERE username = $1 
        LIMIT 1;
        `;

        const result = await database.query(query, [username]);
        return result.rows[0];
    }
}