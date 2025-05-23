import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  
  // Create test users
  const password = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password,
        username: 'johndoe',
        bio: 'Software Developer',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password,
        username: 'janesmith',
        bio: 'UI/UX Designer',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
      }
    })
  ]);

  // Create some posts
  await Promise.all(users.map(user => 
    prisma.post.create({
      data: {
        content: `Hello from ${user.name}!`,
        userId: user.id
      }
    })
  ));

  console.log('Seed data created successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
