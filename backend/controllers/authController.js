import User from '../models/User.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const user = await User.create({ name, email: normalizedEmail, password });
    const safeUser = user.toJSON();
    return res.status(201).json({ message: 'Registration successful', user: safeUser });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' });
    return next(error);
  }
}
