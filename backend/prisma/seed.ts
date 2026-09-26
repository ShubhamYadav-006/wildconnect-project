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
  const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || 'Admin@123456', 10);
  const partnerPassword = await bcrypt.hash(process.env.PARTNER_SEED_PASSWORD || 'Partner@123456', 10);
  const touristPassword = await bcrypt.hash(process.env.TOURIST_SEED_PASSWORD || 'Tourist@123456', 10);

  // 1. Seed Users (1 Admin, 1 Partner, 1 Tourist)
  const adminUser = await prisma.user.upsert({
    where: { email: 'info.tadobatracks@gmail.com' },
    update: { password: adminPassword, role: 'ADMIN' },
    create: {
      firstName: 'Tadoba Tracks',
      lastName: 'Admin',
      email: 'info.tadobatracks@gmail.com',
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

  // Seed Partner KYC for Demo Partner
  await prisma.partnerKyc.upsert({
    where: { userId: partnerUser.id },
    update: {
      idProofUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      status: 'KYC_VERIFIED',
      verifiedAt: new Date(),
    },
    create: {
      userId: partnerUser.id,
      aadhaarNumber: '1234 5678 9012',
      idProofUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      status: 'KYC_VERIFIED',
      verifiedAt: new Date(),
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
  // 5. Seed Nilawar Farms for Partner
  const nilawarFarms = await prisma.business.upsert({
    where: { slug: 'nilawar-farms' },
    update: {
      userId: partnerUser.id,
      status: 'APPROVED',
      coverImage: '/uploads/nilawar-farms-1.png',
      images: [
        '/uploads/nilawar-farms-1.png',
        '/uploads/nilawar-farms-2.png',
        '/uploads/nilawar-farms-3.png',
        '/uploads/nilawar-farms-4.png',
        '/uploads/nilawar-farms-5.png',
        '/uploads/nilawar-farms-6.png',
      ],
    },
    create: {
      name: 'Nilawar Farms',
      slug: 'nilawar-farms',
      type: 'RESORT',
      description: 'Peaceful agritourism farmstay & nature retreat near Tadoba forest borders.',
      address: 'Near Tadoba Buffer Gate, Chandrapur, Maharashtra',
      contactEmail: 'info@nilawarfarms.com',
      contactPhone: '+91 98765 43211',
      coverImage: '/uploads/nilawar-farms-1.png',
      images: [
        '/uploads/nilawar-farms-1.png',
        '/uploads/nilawar-farms-2.png',
        '/uploads/nilawar-farms-3.png',
        '/uploads/nilawar-farms-4.png',
        '/uploads/nilawar-farms-5.png',
        '/uploads/nilawar-farms-6.png',
      ],
      amenities: ['Farm Tour', 'Organic Dining', 'Swimming Pool', 'Bonfire', 'AC Cottages', 'Wi-Fi'],
      status: 'APPROVED',
      destinationId: destination.id,
      userId: partnerUser.id,
    },
  });
  logger.info(`Created / Updated Business: ${nilawarFarms.name}`);

  // Seed 3 Room Types for Nilawar Farms: Deluxe Room, Luxury Cottage, Lake View Room
  const nilawarRooms = [
    {
      name: 'Deluxe Room',
      description: 'Spacious climate-controlled room with king-size bed, private modern bath, and peaceful lush garden vistas.',
      capacity: 2,
      basePrice: 0,
      totalInventory: 6,
      amenities: ['Air Conditioning', 'King Bed', 'Attached Bathroom', 'Garden View', 'Tea/Coffee Maker', 'Wi-Fi'],
      images: ['/uploads/nilawar-farms-2.png', '/uploads/nilawar-farms-3.png'],
    },
    {
      name: 'Luxury Cottage',
      description: 'Private standalone rustic-chic cottage with wooden interiors, verandah seating, and direct open farm views.',
      capacity: 4,
      basePrice: 0,
      totalInventory: 4,
      amenities: ['Private Verandah', 'Air Conditioning', 'King Bed + Lounge', 'Forest Ambience', 'Organic Dining Access', 'Mini Bar'],
      images: ['/uploads/nilawar-farms-4.png', '/uploads/nilawar-farms-5.png'],
    },
    {
      name: 'Lake View Room',
      description: 'Serene lakefront room offering panoramic water views, sunrise balconies, and prime birdwatching proximity.',
      capacity: 3,
      basePrice: 0,
      totalInventory: 4,
      amenities: ['Lake View Balcony', 'Air Conditioning', 'Birdwatching Point', 'En-Suite Bathroom', 'Daily Housekeeping'],
      images: ['/uploads/nilawar-farms-6.png', '/uploads/nilawar-farms-1.png'],
    },
  ];

  for (const r of nilawarRooms) {
    const existingRoom = await prisma.businessRoom.findFirst({
      where: { businessId: nilawarFarms.id, name: r.name },
    });

    if (existingRoom) {
      await prisma.businessRoom.update({
        where: { id: existingRoom.id },
        data: { ...r },
      });
    } else {
      await prisma.businessRoom.create({
        data: {
          ...r,
          businessId: nilawarFarms.id,
        },
      });
    }
  }
  // 6. Seed Tadoba Safari Stay for Partner
  const tadobaSafariStay = await prisma.business.upsert({
    where: { slug: 'tadoba-safari-stay' },
    update: {
      userId: partnerUser.id,
      status: 'APPROVED',
      verifiedAt: new Date(),
      name: 'Tadoba Safari Stay',
      type: 'RESORT',
      description: 'Tadoba Safari Stay is a boutique jungle resort located in Kondegaon Mal near Tadoba–Andhari Tiger Reserve. The property offers 12 rooms across Machaan Cottages, Individual Cottages, Deluxe Rooms, and Family Rooms, with accommodation for up to 38 guests. The resort combines comfortable accommodation with natural surroundings and facilities including a swimming pool, open restaurant, lawn, children\'s play area, and bonfire area. Its proximity to Moharli Gate makes it a convenient base for travelers visiting Tadoba for wildlife safaris.',
      address: '49, At-VG Kondegaon, Bhadravati, Chandrapur, Maharashtra – 442906',
      contactEmail: 'info@tadobasafarisandstays.com',
      contactPhone: '+91 77198 06444',
      starRating: 4,
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Swimming Pool',
        'Open Lawn',
        'Bonfire Area',
        "Children's Play Area",
        'Open Restaurant',
        'Free Parking',
        'Wi-Fi',
        'Air Conditioning',
        'Housekeeping',
        'Hot Water',
        'Indoor Games',
        'Outdoor Activities',
        'Laundry Service',
        'Room Service',
        'Safari Booking Assistance',
      ],
      metadata: {
        shortDescription: 'A boutique jungle resort near Tadoba offering comfortable accommodation, safari access, a swimming pool, restaurant, lawns, and natural surroundings.',
        nearestGate: 'Moharli Core Gate – Approximately 10 minutes',
        otherNearbyGate: 'Khutwanda Gate – Approximately 15 minutes',
        guestCapacity: 'Up to 38 Guests',
        totalRooms: 12,
        dining: 'Open restaurant serving Indian, vegetarian, and Jain food. Breakfast, lunch, and dinner are available. Group meals can also be arranged on request.',
        experiences: 'Tadoba safari access, safari booking assistance, jungle and nature surroundings, jungle/Irai Dam views from selected Machaan Cottages, bonfire, indoor games, outdoor activities, and children\'s play area.',
        highlights: 'Boutique jungle resort, 12 rooms, accommodation for up to 38 guests, close to Moharli Gate, Machaan cottages with natural views, swimming pool, open restaurant, large lawn, children\'s play area, and bonfire area.',
        bestSuitedFor: 'Families, couples, wildlife enthusiasts, wildlife photographers, small groups, safari travelers, and corporate/group outings.',
        checkInOut: 'Current timing should be confirmed with the property.',
        trust: 'Verified WildConnect Partner',
      },
    },
    create: {
      name: 'Tadoba Safari Stay',
      slug: 'tadoba-safari-stay',
      type: 'RESORT',
      description: 'Tadoba Safari Stay is a boutique jungle resort located in Kondegaon Mal near Tadoba–Andhari Tiger Reserve. The property offers 12 rooms across Machaan Cottages, Individual Cottages, Deluxe Rooms, and Family Rooms, with accommodation for up to 38 guests. The resort combines comfortable accommodation with natural surroundings and facilities including a swimming pool, open restaurant, lawn, children\'s play area, and bonfire area. Its proximity to Moharli Gate makes it a convenient base for travelers visiting Tadoba for wildlife safaris.',
      address: '49, At-VG Kondegaon, Bhadravati, Chandrapur, Maharashtra – 442906',
      contactEmail: 'info@tadobasafarisandstays.com',
      contactPhone: '+91 77198 06444',
      starRating: 4,
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Swimming Pool',
        'Open Lawn',
        'Bonfire Area',
        "Children's Play Area",
        'Open Restaurant',
        'Free Parking',
        'Wi-Fi',
        'Air Conditioning',
        'Housekeeping',
        'Hot Water',
        'Indoor Games',
        'Outdoor Activities',
        'Laundry Service',
        'Room Service',
        'Safari Booking Assistance',
      ],
      metadata: {
        shortDescription: 'A boutique jungle resort near Tadoba offering comfortable accommodation, safari access, a swimming pool, restaurant, lawns, and natural surroundings.',
        nearestGate: 'Moharli Core Gate – Approximately 10 minutes',
        otherNearbyGate: 'Khutwanda Gate – Approximately 15 minutes',
        guestCapacity: 'Up to 38 Guests',
        totalRooms: 12,
        dining: 'Open restaurant serving Indian, vegetarian, and Jain food. Breakfast, lunch, and dinner are available. Group meals can also be arranged on request.',
        experiences: 'Tadoba safari access, safari booking assistance, jungle and nature surroundings, jungle/Irai Dam views from selected Machaan Cottages, bonfire, indoor games, outdoor activities, and children\'s play area.',
        highlights: 'Boutique jungle resort, 12 rooms, accommodation for up to 38 guests, close to Moharli Gate, Machaan cottages with natural views, swimming pool, open restaurant, large lawn, children\'s play area, and bonfire area.',
        bestSuitedFor: 'Families, couples, wildlife enthusiasts, wildlife photographers, small groups, safari travelers, and corporate/group outings.',
        checkInOut: 'Current timing should be confirmed with the property.',
        trust: 'Verified WildConnect Partner',
      },
      status: 'APPROVED',
      verifiedAt: new Date(),
      destinationId: destination.id,
      userId: partnerUser.id,
    },
  });
  logger.info(`Created / Updated Business: ${tadobaSafariStay.name}`);

  // Seed 4 Room Types for Tadoba Safari Stay: Machaan Cottage, Individual Cottage, Deluxe Room, Family Room
  const tadobaSafariRooms = [
    {
      name: 'Machaan Cottage',
      description: 'Elevated machaan-style cottage with queen-size bed, private sit-out gallery, scenic jungle and Irai Dam views, and hot-water geyser.',
      capacity: 3,
      basePrice: 0,
      totalInventory: 2,
      amenities: ['Queen Bed', 'Air Conditioning', 'Private Sit-out Gallery', 'Jungle & Irai Dam Views', 'Hot Water Geyser', 'Eco-Design (No TV)'],
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Individual Cottage',
      description: 'Standalone private cottage with king-size bed, private lush lawn, outdoor sit-out seating, hot-water geyser, and extra bed option.',
      capacity: 3,
      basePrice: 0,
      totalInventory: 4,
      amenities: ['King Bed', 'Private Lawn', 'Outdoor Seating', 'Air Conditioning', 'Hot Water Geyser', 'Extra Bed Available'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Deluxe Room',
      description: 'Comfortable air-conditioned room with king-size bed, hot-water geyser, TV, study table, and dedicated wardrobe.',
      capacity: 2,
      basePrice: 0,
      totalInventory: 4,
      amenities: ['King Bed', 'Air Conditioning', 'Television', 'Study Table', 'Wardrobe', 'Hot Water Geyser'],
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Family Room',
      description: 'Spacious interconnected family suite with king-size bed, air conditioning, TV, hot water, and separate beds available on request.',
      capacity: 4,
      basePrice: 0,
      totalInventory: 2,
      amenities: ['King Bed + Extra Beds', 'Interconnected Rooms', 'Air Conditioning', 'Television', 'Hot Water Geyser', 'Family Comfort'],
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ];

  for (const r of tadobaSafariRooms) {
    const existingRoom = await prisma.businessRoom.findFirst({
      where: { businessId: tadobaSafariStay.id, name: r.name },
    });

    if (existingRoom) {
      await prisma.businessRoom.update({
        where: { id: existingRoom.id },
        data: { ...r },
      });
    } else {
      await prisma.businessRoom.create({
        data: {
          ...r,
          businessId: tadobaSafariStay.id,
        },
      });
    }
  }
  // 7. Seed Nature's Sprout – Singh Estate for Partner
  const singhEstate = await prisma.business.upsert({
    where: { slug: 'natures-sprout-singh-estate' },
    update: {
      userId: partnerUser.id,
      status: 'APPROVED',
      verifiedAt: new Date(),
      name: "Nature's Sprout – Singh Estate",
      type: 'RESORT',
      description: "Nature's Sprout – Singh Estate offers a peaceful stay experience for travelers visiting the Tadoba region. The property is positioned as a wildlife-oriented accommodation, providing a comfortable base for exploring Tadoba and its surrounding natural areas.",
      address: 'Near Tadoba Tiger Reserve, Chandrapur, Maharashtra',
      contactEmail: 'info@naturesprout.com',
      contactPhone: '+91 98765 43212',
      starRating: 3,
      coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Swimming Pool',
        'Garden',
        'Open Lawn',
        'Air Conditioning',
        'Wi-Fi',
        'Parking',
        'Restaurant',
        'Indoor & Outdoor Games',
        'Bonfire',
      ],
      metadata: {
        shortDescription: "Nature's Sprout – Singh Estate is a comfortable wildlife stay near Tadoba, offering a peaceful natural setting and convenient access to the Tadoba safari experience.",
        nearestGate: 'Tadoba Safari Gate (Proximity to park borders)',
        dining: 'Restaurant available serving regional and Indian meals. Specific cuisine, meal plans, and inclusions are provided upon enquiry.',
        experiences: 'Tadoba wildlife and safari access, nature surroundings, and outdoor experiences.',
        highlights: 'Peaceful natural setting, wildlife-oriented stay, proximity to Tadoba, suitable for safari travelers.',
        bestSuitedFor: 'Families, couples, wildlife enthusiasts, safari travelers, and small groups.',
        checkInOut: 'Current timing should be confirmed with the property.',
        trust: 'Verified WildConnect Partner',
      },
    },
    create: {
      name: "Nature's Sprout – Singh Estate",
      slug: 'natures-sprout-singh-estate',
      type: 'RESORT',
      description: "Nature's Sprout – Singh Estate offers a peaceful stay experience for travelers visiting the Tadoba region. The property is positioned as a wildlife-oriented accommodation, providing a comfortable base for exploring Tadoba and its surrounding natural areas.",
      address: 'Near Tadoba Tiger Reserve, Chandrapur, Maharashtra',
      contactEmail: 'info@naturesprout.com',
      contactPhone: '+91 98765 43212',
      starRating: 3,
      coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Swimming Pool',
        'Garden',
        'Open Lawn',
        'Air Conditioning',
        'Wi-Fi',
        'Parking',
        'Restaurant',
        'Indoor & Outdoor Games',
        'Bonfire',
      ],
      metadata: {
        shortDescription: "Nature's Sprout – Singh Estate is a comfortable wildlife stay near Tadoba, offering a peaceful natural setting and convenient access to the Tadoba safari experience.",
        nearestGate: 'Tadoba Safari Gate (Proximity to park borders)',
        dining: 'Restaurant available serving regional and Indian meals. Specific cuisine, meal plans, and inclusions are provided upon enquiry.',
        experiences: 'Tadoba wildlife and safari access, nature surroundings, and outdoor experiences.',
        highlights: 'Peaceful natural setting, wildlife-oriented stay, proximity to Tadoba, suitable for safari travelers.',
        bestSuitedFor: 'Families, couples, wildlife enthusiasts, safari travelers, and small groups.',
        checkInOut: 'Current timing should be confirmed with the property.',
        trust: 'Verified WildConnect Partner',
      },
      status: 'APPROVED',
      verifiedAt: new Date(),
      destinationId: destination.id,
      userId: partnerUser.id,
    },
  });
  logger.info(`Created / Updated Business: ${singhEstate.name}`);

  // Seed sample rooms for Singh Estate
  const singhEstateRooms = [
    {
      name: 'Deluxe AC Room',
      description: 'Comfortable air-conditioned room with king-size bed, private bath, garden views, and peaceful natural ambiance.',
      capacity: 2,
      basePrice: 0,
      totalInventory: 6,
      amenities: ['King Bed', 'Air Conditioning', 'Attached Bathroom', 'Garden View', 'Housekeeping'],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Nature Cottage',
      description: 'Standalone rustic cottage surrounded by trees and lawns, featuring air conditioning, verandah seating, and private bathroom.',
      capacity: 3,
      basePrice: 0,
      totalInventory: 4,
      amenities: ['King Bed', 'Private Verandah', 'Air Conditioning', 'Hot Water', 'Lawn Access'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ];

  for (const r of singhEstateRooms) {
    const existingRoom = await prisma.businessRoom.findFirst({
      where: { businessId: singhEstate.id, name: r.name },
    });

    if (existingRoom) {
      await prisma.businessRoom.update({
        where: { id: existingRoom.id },
        data: { ...r },
      });
    } else {
      await prisma.businessRoom.create({
        data: {
          ...r,
          businessId: singhEstate.id,
        },
      });
    }
  }
  logger.info(`Seeded ${singhEstateRooms.length} room types for ${singhEstate.name}`);

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
