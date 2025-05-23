import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { validateImage, generateSecureFilename } from './utils/imageUtils.js';

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

// Rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per windowMs
  message: 'Too many uploads from this IP, please try again later'
});

// Add these constants after imports
const TEMP_UPLOAD_DIR = './uploads/temp';
const PERMANENT_UPLOAD_DIR = './uploads/posts';

// Ensure directories exist
[TEMP_UPLOAD_DIR, PERMANENT_UPLOAD_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer with security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, generateSecureFilename(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    try {
      validateImage(file);
      cb(null, true);
    } catch (err) {
      cb(new Error(err.message));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Serve uploaded files statically
app.use('/uploads', (req, res, next) => {
  // Optional: Add authentication check here
  next();
}, express.static('uploads'));

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
  const { userId, content, images = [] } = req.body;
  try {
    const movedImages = await Promise.all(
      images.map(async (image) => {
        if (image.startsWith('/uploads/temp/')) {
          const fileName = path.basename(image);
          const tempPath = path.join('.', image);
          const newPath = path.join(PERMANENT_UPLOAD_DIR, fileName);
          
          if (fs.existsSync(tempPath)) {
            await fs.promises.rename(tempPath, newPath);
            return `${req.protocol}://${req.get('host')}/uploads/posts/${fileName}`;
          }
        }
        return image;
      })
    );

    const post = await prisma.post.create({
      data: {
        content,
        userId: Number(userId),
        images: movedImages
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        images: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            username: true
          }
        }
      }
    });

    // Create notifications after post is created
    await prisma.notification.createMany({
      data: (await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { followers: true }
      })).followers.map(follower => ({
        type: 'POST',
        message: 'shared a new post',
        userId: follower.id,
        senderId: Number(userId),
        postId: post.id,
        read: false
      }))
    });

    res.json(post);
  } catch (err) {
    logger.error('Post creation error:', err);
    res.status(400).json({ error: 'Failed to create post' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        images: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            username: true
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
    
    const [user, notification] = await prisma.$transaction([
      prisma.user.update({
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
      }),
      prisma.notification.create({
        data: {
          type: 'FOLLOW',
          message: 'started following you',
          userId: Number(id),
          senderId: Number(followerId),
          read: false
        }
      })
    ]);
    
    res.json(user);
  } catch (err) {
    logger.error('Follow error:', err);
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

// Search users endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
      },
    });

    res.json(users);
  } catch (err) {
    logger.error('Search error', { error: err.message });
    res.status(500).json({ error: 'Search failed' });
  }
});

// Image upload endpoint with rate limiting
app.post('/api/upload', uploadLimiter, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    
    const relativePath = path.relative('.', req.file.path).replace(/\\/g, '/');
    const imageUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;
    
    logger.info('Image uploaded', {
      userId: req.body.userId,
      filename: req.file.filename,
      size: req.file.size,
      path: relativePath
    });

    res.json({ url: imageUrl });
  } catch (err) {
    logger.error('Upload error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get notifications with proper filters
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter = 'all' } = req.query;
    
    const where = {
      userId: Number(userId),
      ...(filter === 'unread' && { read: false }),
      ...(filter === 'mentions' && { type: 'mention' })
    };

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        post: {
          select: {
            id: true,
            content: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(notifications);
  } catch (err) {
    logger.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true }
    });
    res.json(notification);
  } catch (err) {
    logger.error('Mark notification read error:', err);
    res.status(400).json({ error: 'Failed to mark notification as read' });
  }
});

// Get unread count with proper error handling
app.get('/api/notifications/:userId/unread/count', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await prisma.notification.count({
      where: {
        userId: Number(userId),
        read: false
      }
    });
    res.json({ count });
  } catch (err) {
    logger.error('Get notification count error:', err);
    res.status(500).json({ error: 'Failed to fetch notification count' });
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

// Add cleanup for temp files (run every hour)
setInterval(async () => {
  try {
    const files = await fs.promises.readdir(TEMP_UPLOAD_DIR);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(TEMP_UPLOAD_DIR, file);
      const stats = await fs.promises.stat(filePath);
      
      // Remove files older than 1 hour
      if (now - stats.mtime.getTime() > 3600000) {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (err) {
    logger.error('Temp file cleanup error:', err);
  }
}, 3600000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));