import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})