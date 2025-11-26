import database from '../config/configDatabase'
import { User } from '../types/types';

export class AuthRepository {

    public async createUser(user: User) {
        const query = `
        INSERT INTO users (id, username, role, password)
        VALUES ($1, $2, $3, $4)
        returning *
        `;

        const values = [
            user.id,
            user.username,
            user.role,
            user.password
        ];

        const result = await database.query(query, values);
        return result.rows[0];
    }

    public async verifyUserByUsername(username: string) {
        const query = `
        SELECT id 
        FROM users 
        WHERE username = $1 
        LIMIT 1;
        `;

        const result = await database.query(query, [username]);
        return result.rows[0];
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