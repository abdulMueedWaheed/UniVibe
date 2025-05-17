import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from './routes/user_routes.js';
import authRoutes from './routes/auth_routes.js';
import postRoutes from './routes/post_routes.js';
import societyRoutes from './routes/society_routes.js';
import commentRoutes from './routes/comment_routes.js';
import likeRoutes from "./routes/like_routes.js";
import relationshipRoutes from "./routes/relationships.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", true);
	next();
});
app.use(express.json());
app.use(cors({
		origin:"http://localhost:5173",
		credentials: true 
	}
));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/relationships', relationshipRoutes);

app.get('/', (req, res) => res.send('Backend is running!'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on: http://localhost:${PORT}`);
});
