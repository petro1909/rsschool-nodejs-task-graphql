import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { User } from "../types/user.js";

type UserSubscribedTo = {
  subscriberId: string;
  author: User;
}
export function createUsersSubscribedLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<User[]>> => {
    const usersSubscribedTo = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: {in: keys as string[] | undefined}
      },
      select: {
        subscriberId: true,
        author: true
      }
    }) as Array<UserSubscribedTo>;

    const usersSubscribedToMap = new Map<string, User[]>();
    usersSubscribedTo.forEach((userSubscribedTo) => {
      let userSubscribedToArray: Array<User>| undefined = usersSubscribedToMap.get(userSubscribedTo.subscriberId);
      if(!userSubscribedToArray) {
        userSubscribedToArray = [];
      }
      userSubscribedToArray.push(userSubscribedTo.author);
      usersSubscribedToMap.set(userSubscribedTo.subscriberId, userSubscribedToArray)
    });
    const orderedUsersSubscribedTo = new Array<User[]>();
    keys.forEach((key) => {
      orderedUsersSubscribedTo.push(usersSubscribedToMap.get(key) as User[])
    })
   
    return new Promise((resolve) => resolve(orderedUsersSubscribedTo));
  })
}

type UserSubscribers = {
  authorId: string;
  subscriber: User;
}
export function createUsersSubscribersLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<User[]>> => {
    const usersSubscribers = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: {in: keys as string[] | undefined}
      },
      select: {
        authorId: true,
        subscriber: true
      }
    }) as Array<UserSubscribers>;

    const usersSubscribersMap = new Map<string, User[]>();
    usersSubscribers.forEach((userSubscriber) => {
      let userSubscribersArray = usersSubscribersMap.get(userSubscriber.authorId);
      if(!userSubscribersArray) {
        userSubscribersArray = [];
      }
      userSubscribersArray.push(userSubscriber.subscriber);
      usersSubscribersMap.set(userSubscriber.authorId, userSubscribersArray)
    });
    const orderedUsersSubscribers = new Array<User[]>();
    keys.forEach((key) => {
      orderedUsersSubscribers.push(usersSubscribersMap.get(key) as User[])
    })
   
    return new Promise((resolve) => resolve(orderedUsersSubscribers));
  })
}