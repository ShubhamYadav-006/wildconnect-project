import { PrismaClient } from '../src/generated/prisma/index.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { env } from '../src/config/env.js';
import { logger } from '../src/config/logger.js';

const connectionString = env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  logger.info('Seeding database...');

  // Hash passwords securely (10 salt rounds)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const partnerPassword = await bcrypt.hash('partner123', 10);
  const touristPassword = await bcrypt.hash('tourist123', 10);

  // 1. Seed Users (1 Admin, 1 Partner, 1 Tourist)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wildconnect.com' },
    update: { password: adminPassword },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@wildconnect.com',
      password: adminPassword,
      phone: '+1234567890',
      role: 'ADMIN',
    },
  });

  const partnerUser = await prisma.user.upsert({
    where: { email: 'partner@wildconnect.com' },
    update: { password: partnerPassword },
    create: {
      firstName: 'Sarah',
      lastName: 'Partner',
      email: 'partner@wildconnect.com',
      password: partnerPassword,
      phone: '+1987654321',
      role: 'BUSINESS_PARTNER',
    },
  });

  const touristUser = await prisma.user.upsert({
    where: { email: 'tourist@example.com' },
    update: { password: touristPassword },
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'tourist@example.com',
      password: touristPassword,
      phone: '+0987654321',
      role: 'TOURIST',
    },
  });
  logger.info(`Created Users: ${adminUser.email}, ${partnerUser.email}, ${touristUser.email}`);

  // 2. Seed Destination (1 Destination)
  const destination = await prisma.destination.upsert({
    where: { slug: 'tadoba-andhari-tiger-reserve' },
    update: {
      establishedYear: 1955,
      totalArea: 1727.17,
      coreArea: 625.40,
      coreGates: 6,
      bufferArea: 1101.77,
      bufferGates: 16,
    },
    create: {
      name: 'Tadoba Andhari Tiger Reserve',
      slug: 'tadoba-andhari-tiger-reserve',
      description: 'Maharashtra\'s oldest and largest national park, known for its tiger sightings.',
      bestSeason: 'October to June',
      state: 'Maharashtra',
      country: 'India',
      establishedYear: 1955,
      totalArea: 1727.17,
      coreArea: 625.40,
      coreGates: 6,
      bufferArea: 1101.77,
      bufferGates: 16,
    },
  });
  logger.info(`Created Destination: ${destination.name}`);

  // 3. Seed Resort (1 Resort)
  let resort = await prisma.resort.findFirst({
    where: {
      name: 'Svasara Jungle Lodge',
      destinationId: destination.id,
    }
  });

  if (!resort) {
    resort = await prisma.resort.create({
      data: {
        name: 'Svasara Jungle Lodge',
        description: 'A premium jungle lodge located close to Kolara gate.',
        address: 'Near Kolara Gate, Tadoba Andhari Tiger Reserve',
        starRating: 4,
        amenities: ['Pool', 'AC', 'Wi-Fi', 'Restaurant'],
        destinationId: destination.id,
      },
    });
  }
  logger.info(`Created Resort: ${resort.name}`);

  // 4. Seed Business for Partner
  const business = await prisma.business.upsert({
    where: { slug: 'tadoba-wilderness-resort' },
    update: {
      userId: partnerUser.id,
      status: 'APPROVED',
    },
    create: {
      name: 'Tadoba Wilderness Resort & Safari',
      slug: 'tadoba-wilderness-resort',
      type: 'RESORT',
      description: 'Luxury eco-friendly cottages immersed in the heart of Tadoba forest buffer zone.',
      address: 'Moharli Gate Road, Tadoba, Maharashtra',
      contactEmail: 'contact@tadobawilderness.com',
      contactPhone: '+91 98765 43210',
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Safari Booking', 'Swimming Pool', 'Buffet Dining', 'Guided Nature Walks', 'Wi-Fi'],
      status: 'APPROVED',
      destinationId: destination.id,
      userId: partnerUser.id,
    }
  });

  // Seed sample room
  const existingRoom = await prisma.businessRoom.findFirst({
    where: { businessId: business.id }
  });

  if (!existingRoom) {
    await prisma.businessRoom.create({
      data: {
        businessId: business.id,
        name: 'Deluxe Jungle Villa',
        description: 'Spacious air-conditioned wooden villa with private veranda and jungle views.',
        capacity: 3,
        basePrice: 150,
        totalInventory: 5,
        amenities: ['King Bed', 'AC', 'Private Balcony', 'Tea/Coffee Maker', 'Attached Bathroom'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80']
      }
    });
  }
  logger.info(`Created Business & Room for Partner: ${business.name}`);

  logger.info('Seeding completed successfully!');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
