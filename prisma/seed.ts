import { GroupsOnUsers, PrismaClient } from '@prisma/client';
const usersJson = require('./seed.data/users.json');
const markersJson = require('./seed.data/markers.json');
const avatarsJson = require('./seed.data/avatars.json');
const groupsJson = require('./seed.data/groups.json');
const groupsOnUsersJson = require('./seed.data/group-users.json');

const client = new PrismaClient();

console.log('usersJson', usersJson.length);
console.log('markersJson', markersJson.length);
console.log('avatarsJson', avatarsJson.length);
console.log('groupsJson', groupsJson);
console.log('groupsOnUsersJson', groupsOnUsersJson.length);

async function users(prisma: PrismaClient) {
  return Promise.all(
    usersJson.map(async (item) =>
      prisma.user.upsert({ where: { id: item.id }, update: {}, create: item }),
    ),
  );
}

async function markers(prisma: PrismaClient) {
  return Promise.all(
    markersJson.map(async (item) =>
      prisma.marker.upsert({
        where: { id: item.id },
        update: {},
        create: item,
      }),
    ),
  );
}

async function avatars(prisma: PrismaClient) {
  return Promise.all(
    avatarsJson.map(async (item) =>
      prisma.publicFile.upsert({
        where: { id: item.id },
        update: {},
        create: item,
      }),
    ),
  );
}

async function groups(prisma: PrismaClient) {
  return Promise.all(
    groupsJson.map(async (item) =>
      prisma.group.upsert({
        where: { id: item.id },
        update: {},
        create: item,
      }),
    ),
  );
}

async function groupsOnUsers(prisma: PrismaClient) {
  return Promise.all(
    groupsOnUsersJson.map(async (item: GroupsOnUsers) =>
      prisma.groupsOnUsers.upsert({
        where: {
          user_id_group_id: { group_id: item.group_id, user_id: item.user_id },
        },
        update: {},
        create: item,
      }),
    ),
  );
}

async function main() {
  await client.$transaction(async (prisma: PrismaClient) => {
    await users(prisma);
    await markers(prisma);
    await avatars(prisma);
    await groups(prisma);
    await groupsOnUsers(prisma);
  });
}
main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
