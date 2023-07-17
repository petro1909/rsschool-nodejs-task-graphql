import  graphql, { GraphQLList }  from "graphql";
import { UUIDType } from "../types/gqlTypes/uuid.js";
import { CreatePostInput, ChangePostInput, PostType } from "../types/gqlTypes/post.js";
import { Post, PostInput } from "../types/post.js";
import { Context } from "../types/context.js";


const post: graphql.GraphQLFieldConfig<Post, Context, PostInput> = {
  type: PostType,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }, context) => {
    return await context.prisma.post.findFirst({
      where: {
        id: id
      }
    });
  },
};
const posts: graphql.GraphQLFieldConfig<Post, Context, PostInput> = {
  type: new GraphQLList(PostType),
  resolve: async (_, args, context) => {
    return await context.prisma.post.findMany();
  }
}



const createPost: graphql.GraphQLFieldConfig<Post, Context, PostInput> = {
  type: PostType,
  args: {
    dto: { type: CreatePostInput},
  },
  resolve: async (_, {dto}, context) => {
    return context.prisma.post.create({data: dto});
  }
};

const changePost: graphql.GraphQLFieldConfig<Post, Context, PostInput> ={
  type: PostType,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
    dto: { type: new graphql.GraphQLNonNull(ChangePostInput)}
  },
  resolve: async (_, {id, dto}, context) => {
    return await context.prisma.post.update({
      where: {
        id: id
      },
      data: dto
    });
  }
};
    
const deletePost: graphql.GraphQLFieldConfig<Post, Context, PostInput> = {
  type: graphql.GraphQLBoolean,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, {id}, context) => {
    try {
      await context.prisma.post.delete({
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


export const PostQueries = {
  post,
  posts
};
export const PostMutations =  {
  createPost,
  changePost,
  deletePost
};