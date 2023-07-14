import { PrismaClient } from "@prisma/client";
import  graphql, { GraphQLList }  from "graphql";
import { UUIDType } from "../types/uuid.js";
import { CreatePostInput, ChangePostInput, PostType } from "../types/post.js";

export const PostQueries = {
  post:  {
    type: PostType,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }) => {
      return await new PrismaClient().post.findFirst({
        where: {
          id: id
        }
      });
    },
  },
  posts: {
    type: new GraphQLList(PostType),
    resolve: async () => {
      return await new PrismaClient().post.findMany();
    }
  }
}

export const PostMutations = {
  createPost: {
    type: PostType,
    args: {
      dto: { type: CreatePostInput},
    },
    resolve: async (_, {dto}) => {
      return new PrismaClient().post.create({data: dto});
    }
  },
  changePost: {
    type: PostType,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
      dto: { type: new graphql.GraphQLNonNull(ChangePostInput)}
    },
    resolve: async (_, {id, dto}) => {
      return await new PrismaClient().post.update({
        where: {
          id: id
        },
        data: dto
      });
    }
  }, 
  deletePost: {
    type: graphql.GraphQLBoolean,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, {id}) => {
      try {
        await new PrismaClient().post.delete({
          where: {
            id: id
          }
        });
        return true;
      } catch(err) {
        return false;
      }
      
    }
  }
}