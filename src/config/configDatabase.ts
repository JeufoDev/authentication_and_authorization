import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    host: process.env.HOST_DB,
    port: Number(process.env.PORT_DB),
    database: process.env.DATABASE,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB
});

export default pool;