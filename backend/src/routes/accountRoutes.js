import express from 'express';
import { getAllUsers, getBalance, getStatement, makeTransfer } from '../controllers/accountController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.get("/statement", authMiddleware, getStatement);
router.post("/transfer", authMiddleware, makeTransfer);
router.get("/users", authMiddleware, getAllUsers);

export default router;