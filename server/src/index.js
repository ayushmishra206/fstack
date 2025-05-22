import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('API running!'));

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password, bio, avatar } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, password, bio, avatar }
    });
    res.json({ id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or invalid data.' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar });
});

// Profile update endpoint
app.put('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bio, avatar } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, bio, avatar }
    });
    res.json({ id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar });
  } catch (err) {
    res.status(400).json({ error: 'Update failed.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));