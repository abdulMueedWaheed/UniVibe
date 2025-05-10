import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";

import supabase from './config/supabaseClient.js';
import userRoutes from './routes/user_routes.js';
import authRoutes from './routes/auth_routes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Backend is running!'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on: http://localhost:${PORT}`);
});
