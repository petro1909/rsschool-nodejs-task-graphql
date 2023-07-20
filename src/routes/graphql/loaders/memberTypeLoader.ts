import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { MemberType } from "../types/memberType.js";

export function createMemberTypeLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<MemberType>> => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {in: keys as string[] | undefined}
      }
    }) as MemberType[];

    const memberTypesMap = new Map<string, MemberType>();
    memberTypes.forEach((memberType) => {
      memberTypesMap.set(memberType.id, memberType);
    });
    const orderedMemberTypes = new Array<MemberType>();
    keys.forEach((key) => {
      orderedMemberTypes.push(memberTypesMap.get(key) as MemberType)
    })
    return new Promise((resolve) => resolve(orderedMemberTypes));
  })
}