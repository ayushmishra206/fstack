import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger.js';

dotenv.config();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('API running!'));

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt', { email });
    
    if (!email || !password) {
      logger.warn('Missing credentials', { email });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn('User not found', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Invalid password', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    logger.info('Login successful', { email, userId: user.id });
    return res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    logger.error('Login error', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password, bio, avatar } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        bio, 
        avatar 
      }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    logger.error('Registration error', { error: err.message, stack: err.stack });
    res.status(400).json({ error: 'Email already exists or invalid data.' });
  }
});

// Update profile endpoint
app.put('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bio, avatar, location, website, username, banner } = req.body;
  
  try {
    logger.info('Profile update attempt', { userId: id, updates: req.body });

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Clean up data - convert empty strings to null
    const cleanData = {
      name,
      username: username || null,
      bio: bio || null,
      avatar: avatar || null,
      banner: banner || null,
      location: location || null,
      website: website || null
    };

    // Check username uniqueness only if it's being changed
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
      });
      if (existingUser && existingUser.id !== Number(id)) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: cleanData,
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        },
        followers: {
          select: { id: true, name: true, avatar: true }
        },
        following: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (err) {
    logger.error('Profile update error', { 
      userId: id, 
      error: err.message, 
      stack: err.stack 
    });
    res.status(400).json({ 
      error: 'Update failed', 
      details: err.message 
    });
  }
});

// Create post endpoint
app.post('/api/posts', async (req, res) => {
  const { userId, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId: Number(userId)
      },
      include: {
        user: true // Include user data in response
      }
    });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create post' });
  }
});

// Get all posts endpoint
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
});

// Follow user endpoint
app.post('/api/users/:id/follow', async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;
    
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        followers: {
          connect: { id: Number(followerId) }
        }
      },
      include: {
        followers: true,
        following: true
      }
    });
    
    logger.info('User followed', { userId: id, followerId });
    res.json(user);
  } catch (err) {
    logger.error('Follow error', { error: err.message });
    res.status(400).json({ error: 'Failed to follow user' });
  }
});

// Unfollow user endpoint
app.post('/api/users/:id/unfollow', async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;
    
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        followers: {
          disconnect: { id: Number(followerId) }
        }
      },
      include: {
        followers: true,
        following: true
      }
    });
    
    logger.info('User unfollowed', { userId: id, followerId });
    res.json(user);
  } catch (err) {
    logger.error('Unfollow error', { error: err.message });
    res.status(400).json({ error: 'Failed to unfollow user' });
  }
});

// Get all users with follow info
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        followers: true,
        following: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });
    res.json(users.map(({ password, ...user }) => user));
  } catch (err) {
    logger.error('Get users error', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user profile endpoint
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        },
        posts: {
          orderBy: { createdAt: 'desc' }
        },
        followers: {
          select: { id: true, name: true, avatar: true, username: true }
        },
        following: {
          select: { id: true, name: true, avatar: true, username: true }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    logger.error('Get user profile error', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));