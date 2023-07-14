import graphql from "graphql";
import { UUIDType } from "./uuid.js";
import { UserType } from "./user.js";
import { PrismaClient } from "@prisma/client";

export const PostType = new graphql.GraphQLObjectType({
  name: 'Post',
  fields:() => ({
    id: {type: new graphql.GraphQLNonNull(UUIDType)},
    title: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
    content: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
    authorId: {type: new graphql.GraphQLNonNull(UUIDType)},
    author: {
      type: new graphql.GraphQLNonNull(UserType),
      resolve(source) {
        return new PrismaClient().user.findFirst({
          where: {
            id: source.authorId
          }
        })
      }
    }
  }),
})

export const CreatePostInput = new graphql.GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    authorId: {type: UUIDType},
    content: {type: graphql.GraphQLString},
    title: {type: graphql.GraphQLString}
  },
})

export const ChangePostInput = new graphql.GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: {type: graphql.GraphQLString},
    content: {type: graphql.GraphQLString},
  },
})