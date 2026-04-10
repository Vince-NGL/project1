import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth';
import searchRouter from './routes/search';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
