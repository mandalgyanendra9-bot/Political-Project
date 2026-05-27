require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function upsertUserByMobile({
  name,
  email,
  mobile,
  password,
  role,
  status = 'ACTIVE',
}) {
  return prisma.user.upsert({
    where: { mobile },
    update: {
      name,
      email,
      password,
      role,
      status,
    },
    create: {
      name,
      email,
      mobile,
      password,
      role,
      status,
    },
  });
}

async function main() {
  // 1. Promote primary admin (no hard dependency on demo admin account)
  const primaryAdminEmail = (process.env.PRIMARY_ADMIN_EMAIL || 'mandalgyanu2823297@gmail.com')
    .trim()
    .toLowerCase();
  const primaryAdminName = (process.env.PRIMARY_ADMIN_NAME || 'Primary Admin').trim();
  const primaryAdminMobile = (process.env.PRIMARY_ADMIN_MOBILE || '').trim();
  const primaryAdminPasswordRaw = String(process.env.PRIMARY_ADMIN_PASSWORD || '').trim();

  let primaryAdmin = null;

  if (primaryAdminMobile && primaryAdminPasswordRaw) {
    const primaryAdminPassword = await bcrypt.hash(primaryAdminPasswordRaw, 10);
    primaryAdmin = await upsertUserByMobile({
      name: primaryAdminName,
      email: primaryAdminEmail,
      mobile: primaryAdminMobile,
      password: primaryAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    });
  } else {
    const promoted = await prisma.user.updateMany({
      where: { email: primaryAdminEmail },
      data: { role: 'ADMIN', status: 'ACTIVE' },
    });
    if (promoted.count === 0) {
      console.warn(`Primary admin email not found during seed: ${primaryAdminEmail}`);
    }
    primaryAdmin = await prisma.user.findUnique({
      where: { email: primaryAdminEmail },
      select: { id: true },
    });
  }

  // 2. Sample members
  const memberPassword = await bcrypt.hash('Member123!', 10);
  const membersData = [
    { name: 'Alice Sharma', email: 'alice@example.com', mobile: '1111111111' },
    { name: 'Bob Patel', email: 'bob@example.com', mobile: '2222222222' },
  ];

  const members = [];
  for (const data of membersData) {
    const user = await upsertUserByMobile({
      ...data,
      password: memberPassword,
      role: 'MEMBER',
      status: 'ACTIVE',
    });
    members.push(user);
  }

  // 3. Sample news
  const newsItems = [
    {
      title: 'UAP Launches New Education Reform Initiative',
      content: 'Unchi Awaaj Party (UAP) today announced a comprehensive plan to overhaul public education, focusing on affordable higher education and digital classrooms.',
      type: 'NEWS',
    },
    {
      title: 'Environmental Pledge Day Recap',
      content: 'Thousands joined our clean-up drives across the country. See photos and videos from the event.',
      type: 'CAMPAIGN',
    },
  ];

  for (const item of newsItems) {
    const existingNews = await prisma.news.findFirst({
      where: { title: item.title },
      select: { id: true },
    });

    if (!existingNews) {
      await prisma.news.create({ data: item });
    }
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

  for (const ev of eventsData) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: ev.title,
        date: ev.date,
      },
      select: { id: true },
    });

    if (!existingEvent) {
      await prisma.event.create({ data: ev });
    }
  }

  // 5. Sample donations (linked to members)
  const donationsData = [
    { userId: members[0].id, amount: 50.0 },
    { userId: members[1].id, amount: 75.5 },
    ...(primaryAdmin?.id ? [{ userId: primaryAdmin.id, amount: 100.0 }] : []),
  ];

  const donationCount = await prisma.donation.count();
  if (donationCount === 0) {
    for (const d of donationsData) {
      await prisma.donation.create({
        data: {
          userId: d.userId,
          amount: d.amount,
          referenceId: `SEED-${Date.now()}-${Math.round(Math.random() * 1000)}`,
        },
      });
    }
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
