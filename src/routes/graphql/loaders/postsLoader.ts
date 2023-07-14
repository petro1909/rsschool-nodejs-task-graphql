import { PrismaClient, Prisma } from "@prisma/client";
import DataLoader from "dataloader";

export function createPostsLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {in: keys as Prisma.Enumerable<string> | undefined}
      }
    })
    console.log(posts);
    const postMap = new Map();
    posts.forEach((post) => {
      let authorPostArray = postMap.get(post.authorId);
      if(!authorPostArray) {
        authorPostArray = [];
      }
      authorPostArray.push(post);
      postMap.set(post.authorId, authorPostArray)
    });
    const orderedPosts = new Array<any>();
    keys.forEach((key) => {
      orderedPosts.push(postMap.get(key))
    })
   
    return new Promise((resolve) => resolve(orderedPosts));
  })
}