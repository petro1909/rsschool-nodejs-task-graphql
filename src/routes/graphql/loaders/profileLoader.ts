import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Profile } from "../types/profile.js";

export function createProfileLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<Profile>> => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {in: keys as string[] | undefined}
      }
    }) as Profile[];

    const profileMap = new Map<string, Profile>();
    profiles.forEach((profile) => {
      profileMap.set(profile.userId, profile);
    });
    const orderedProfiles = new Array<Profile>();
    keys.forEach((key) => {
      orderedProfiles.push(profileMap.get(key) as Profile)
    })
    return new Promise((resolve) => resolve(orderedProfiles));
  })
}