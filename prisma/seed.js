require('dotenv').config();


const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Default admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pdp.test' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@pdp.test',
      mobile: '9999999999',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 2. Sample members
  const memberPassword = await bcrypt.hash('Member123!', 10);
  const membersData = [
    { name: 'Alice Sharma', email: 'alice@example.com', mobile: '1111111111' },
    { name: 'Bob Patel', email: 'bob@example.com', mobile: '2222222222' },
  ];
  const members = [];
  for (const data of membersData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        password: memberPassword,
        role: 'MEMBER',
      },
    });
    members.push(user);
  }

  // 3. Sample news
  const newsItems = [
    {
      title: 'PDP Launches New Education Reform Initiative',
      content: 'The Progressive Democratic Party today announced a comprehensive plan to overhaul public education, focusing on affordable higher education and digital classrooms.',
      type: 'NEWS',
    },
    {
      title: 'Environmental Pledge Day Recap',
      content: 'Thousands joined our clean‑up drives across the country. See photos and videos from the event.',
      type: 'CAMPAIGN',
    },
  ];
  for (const item of newsItems) {
    await prisma.news.create({ data: item });
  }

  // 4. Sample events
  const now = new Date();
  const eventsData = [
    {
      title: 'National Education Reform Rally',
      description: 'Join us for a rally in New Delhi promoting equitable education.',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 15, 10, 0),
      location: 'Capital Grounds, New Delhi',
      isOnline: false,
    },
    {
      title: 'Virtual Townhall: Digital Governance',
      description: 'Online discussion with policymakers about digital services.',
      date: new Date(now.getFullYear(), now.getMonth() + 2, 5, 18, 0),
      location: 'Online (Zoom)',
      isOnline: true,
    },
  ];
  const createdEvents = [];
  for (const ev of eventsData) {
    const e = await prisma.event.create({ data: ev });
    createdEvents.push(e);
  }

  // 5. Sample donations (linked to members)
  const donationsData = [
    { userId: members[0].id, amount: 50.0 },
    { userId: members[1].id, amount: 75.5 },
    { userId: admin.id, amount: 100.0 },
  ];
  for (const d of donationsData) {
    await prisma.donation.create({
      data: {
        userId: d.userId,
        amount: d.amount,
        referenceId: `SEED-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      },
    });
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
