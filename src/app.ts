import express from 'express';
import helmet from 'helmet';
import router from './routes/authRoutes';


const app = express();
app.use(helmet());
app.use(express.json());
app.use("/auth", router)

export default app;