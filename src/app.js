import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from './middlewares/cors.js';
import loggerMiddleware from './middlewares/logger.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { PORT = 3005, MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

app.use(express.json());
app.use(cors);
app.use(loggerMiddleware);

// Обслуживание статических файлов из папки public
app.use(express.static(path.join(__dirname, '..', 'public')));

// API маршруты
app.use('/api', routes);

// Для всех остальных маршрутов отправляем index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: 'Invalid ID format', details: err.message });
    }
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({ message: 'Validation Error', errors });
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate key error', details: err.message });
    }
    res.status(500).json({ message: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;