import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token'] as string;
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send({ message: 'Failed to authenticate token.' });
  }

  next();
};
