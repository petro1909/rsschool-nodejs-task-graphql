import { PrismaClient, Prisma } from "@prisma/client";
import DataLoader from "dataloader";

export function createUsersSubscribedLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>) => {
    const usersSubscribedTo = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: {in: keys as Prisma.Enumerable<string> | undefined}
      },
      select: {
        subscriberId: true,
        author: true
      }
    })
    const usersSubscribedToMap = new Map();
    usersSubscribedTo.forEach((userSubscribedTo) => {
      let userSubscribedToArray = usersSubscribedToMap.get(userSubscribedTo.subscriberId);
      if(!userSubscribedToArray) {
        userSubscribedToArray = [];
      }
      userSubscribedToArray.push(userSubscribedTo.author);
      usersSubscribedToMap.set(userSubscribedTo.subscriberId, userSubscribedToArray)
    });
    const orderedUsersSubscribedTo = new Array<any>();
    keys.forEach((key) => {
      orderedUsersSubscribedTo.push(usersSubscribedToMap.get(key))
    })
   
    return new Promise((resolve) => resolve(orderedUsersSubscribedTo));
  })
}

export function createUsersSubscribersLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>) => {
    const usersSubscribers = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: {in: keys as Prisma.Enumerable<string> | undefined}
      },
      select: {
        authorId: true,
        subsriber: true
      }
    })
    const usersSubscribersMap = new Map();
    usersSubscribers.forEach((userSubscriber) => {
      let userSubscribersArray = usersSubscribersMap.get(userSubscriber.authorId);
      if(!userSubscribersArray) {
        userSubscribersArray = [];
      }
      userSubscribersArray.push(userSubscriber.subsriber);
      usersSubscribersMap.set(userSubscriber.authorId, userSubscribersArray)
    });
    const orderedUsersSubscribers = new Array<any>();
    keys.forEach((key) => {
      orderedUsersSubscribers.push(usersSubscribersMap.get(key))
    })
   
    return new Promise((resolve) => resolve(orderedUsersSubscribers));
  })
}