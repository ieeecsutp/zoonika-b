
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { registerUser, findUserByEmail, comparePassword, recordLogin } from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { nombre, email, password } = req.body;
  try {
    const user = await registerUser(nombre, email, password);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    await recordLogin(user.id);

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      id: user.id, 
      nombre: user.nombre, 
      email: user.email, 
      token 
    });
  } catch (e) {
    next(e);
  }
};
