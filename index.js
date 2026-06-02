import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import tableRoute from './routes/table.route.js';
import sessionRoute from './routes/session.route.js';
import itemRoute from './routes/item.route.js';
import invoiceRoute from './routes/invoice.route.js';
import { TABLE_API, SESSION_API, ITEM_API, INVOICE_API } from './utils/constant.js';
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
app.use(SESSION_API, sessionRoute);
app.use(ITEM_API, itemRoute);
app.use(INVOICE_API, invoiceRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
