import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/index.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
    // Hash passwords securely (10 salt rounds)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const touristPassword = await bcrypt.hash('tourist123', 10);
    // 1. Seed Users (1 Admin, 1 Tourist)
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
    console.log(`Created Users: ${adminUser.email}, ${touristUser.email}`);
    // 2. Seed Destination (1 Destination)
    const destination = await prisma.destination.upsert({
        where: { slug: 'tadoba-andhari-tiger-reserve' },
        update: {},
        create: {
            name: 'Tadoba Andhari Tiger Reserve',
            slug: 'tadoba-andhari-tiger-reserve',
            description: 'Maharashtra\'s oldest and largest national park, known for its tiger sightings.',
            bestSeason: 'October to June',
            state: 'Maharashtra',
            country: 'India',
        },
    });
    console.log(`Created Destination: ${destination.name}`);
    // 3. Seed Safari Gate (1 Safari Gate)
    const moharliGate = await prisma.safariGate.upsert({
        where: {
            destinationId_name: {
                destinationId: destination.id,
                name: 'Moharli Gate',
            },
        },
        update: {},
        create: {
            name: 'Moharli Gate',
            description: 'The most popular gate offering excellent tiger sightings.',
            destinationId: destination.id,
        },
    });
    console.log(`Created Safari Gate: ${moharliGate.name}`);
    // 4. Seed Resort (1 Resort)
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
    console.log(`Created Resort: ${resort.name}`);
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map