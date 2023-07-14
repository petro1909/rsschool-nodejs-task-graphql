import graphql from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "../types/profile.js";
import { PostType } from "../types/post.js";
import { PrismaClient } from "@prisma/client";

export const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  fields:() => ({
    id: {type: new graphql.GraphQLNonNull(UUIDType)},
    name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
    balance: {type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)},
    profile: {
      type: ProfileType,
      resolve: async(source) => {
        return await new PrismaClient().profile.findFirst({
          where:{
            userId: source.id
          }
        })
      }
    },
    posts: {
      type: new graphql.GraphQLList(PostType),
      resolve: async(source) => {
        return await new PrismaClient().post.findMany({
          where: {
            authorId: source.id
          }
        })
      }
    },
    userSubscribedTo: {
      type: new graphql.GraphQLList(UserType),
      resolve: async (source) => {
        const prisma = new PrismaClient();
        const authorsObj = await prisma.subscribersOnAuthors.findMany({
          where: {
            subscriberId: source.id
          },
          select: {
            author: true
          }
        });
        return authorsObj.map((obj) => obj.author);
      }
    },
    subscribedToUser: {
      type: new graphql.GraphQLList(UserType),
      resolve: async(source) => {
        const prisma = new PrismaClient();
        const subscriberObj = await prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: source.id
          },
          select: {
            subsriber: true
          }
        });
        return subscriberObj.map((obj) => obj.subsriber);
      }
    }
  }),
})

export const CreateUserInput = new graphql.GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
    balance: {type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)},
  },
})

export const ChangeUserInput = new graphql.GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {type: graphql.GraphQLString},
    balance: {type: graphql.GraphQLFloat},
  },
})