import express from 'express'
import { auth } from '../middlewares/auth.js';
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/creations', auth, getUserCreations);
userRouter.get('/creations/published', auth, getPublishedCreations);
userRouter.put('creations/:id/toggle-like', auth, toggleLikeCreation);

export default userRouter;