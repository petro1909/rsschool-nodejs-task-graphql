import { PrismaClient, Prisma } from "@prisma/client";
import DataLoader from "dataloader";

export function createMemberTypeLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {in: keys as Prisma.Enumerable<string> | undefined}
      }
    })
    const memberTypesMap = new Map();
    memberTypes.forEach((memberType) => {
      memberTypesMap.set(memberType.id, memberType);
    });
    const orderedMemberTypes = new Array<any>();
    keys.forEach((key) => {
      orderedMemberTypes.push(memberTypesMap.get(key))
    })
    return new Promise((resolve) => resolve(orderedMemberTypes));
  })
}