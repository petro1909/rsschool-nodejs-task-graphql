import { PrismaClient, Prisma } from "@prisma/client";
import DataLoader from "dataloader";

export function createProfileLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {in: keys as Prisma.Enumerable<string> | undefined}
      }
    })
    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(profile.userId, profile);
    });
    const orderedProfiles = new Array<any>();
    keys.forEach((key) => {
      orderedProfiles.push(profileMap.get(key))
    })
    return new Promise((resolve) => resolve(orderedProfiles));
  })
}