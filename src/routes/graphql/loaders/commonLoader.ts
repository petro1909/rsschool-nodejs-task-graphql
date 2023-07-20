import { PrismaClient } from "@prisma/client";
import { createPostsLoader } from "./postsLoader.js";
import { createProfileLoader } from "./profileLoader.js";
import { createMemberTypeLoader } from "./memberTypeLoader.js";
import { createUsersSubscribedLoader, createUsersSubscribersLoader } from "./subscribersLoader.js";

export function createDataLoaders(prisma: PrismaClient) {
  return {
    profileLoader: createProfileLoader(prisma),
    postsLoader: createPostsLoader(prisma),
    memberTypeLoader: createMemberTypeLoader(prisma),
    userSubscribedTo: createUsersSubscribedLoader(prisma),
    userSubscribers: createUsersSubscribersLoader(prisma),
  }
}


