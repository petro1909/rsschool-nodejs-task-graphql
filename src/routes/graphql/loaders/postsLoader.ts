import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Post } from "../types/post.js";

export function createPostsLoader(prisma: PrismaClient) {
  return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<Post[]>> => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {in: keys as string[] | undefined}
      }
    }) as Array<Post>;
  
    const postMap = new Map<string, Post[]>();
    posts.forEach((post) => {
      let authorPostArray = postMap.get(post.authorId);
      if(!authorPostArray) {
        authorPostArray = [];
      }
      authorPostArray.push(post);
      postMap.set(post.authorId, authorPostArray)
    });
    const orderedPosts = new Array<Post[]>();
    keys.forEach((key) => {
      orderedPosts.push(postMap.get(key) as Post[])
    })
    
    return new Promise((resolve) => resolve(orderedPosts));
  })
}