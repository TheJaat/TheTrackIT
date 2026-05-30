import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('test', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@thejat.in',
    },
    update: {},
    create: {
      name: 'TheJat',
      email: 'admin@thejat.in',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin user created');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });