import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import tableRoute from './routes/table.route.js';
import { TABLE_API } from './utils/constant.js';
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:8081',
  credentials: true,
}
app.use(cors(corsOptions));

const PORT = 3000;

// api's
app.use(TABLE_API, tableRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
