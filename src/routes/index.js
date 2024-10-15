import express from 'express';
import userRoutes from './users.js';
import bookRoutes from './books.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;