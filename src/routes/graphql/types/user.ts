import graphql from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "../types/profile.js";
import { PostType } from "../types/post.js";
import { PrismaClient } from "@prisma/client";
import * as gqlResolveInfo from 'graphql-parse-resolve-info';

export let UserType: graphql.GraphQLObjectType;

export function createUserType(prisma: PrismaClient) {
  UserType = new graphql.GraphQLObjectType({
    name: 'User',
    fields:() => ({
      id: {type: new graphql.GraphQLNonNull(UUIDType)},
      name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
      balance: {type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)},
      profile: {
        type: ProfileType,
        resolve: async(source, args, context) => {
          const profile = await context.loaders.profileLoader.load(source.id);
          return profile;
        }
      },
      posts: {
        type: new graphql.GraphQLList(PostType),
        resolve: async(source, args, context) => {
          const posts = await context.loaders.postsLoader.load(source.id);
          return posts;
        }
      },
      userSubscribedTo: {
        type: new graphql.GraphQLList(UserType),
        resolve: async (source, args, context, resolveInfo) => {   
          //console.log(context.data.subTo);       
          if(context.data.subTo){
            return context.data.subTo.get(source.id);
          }
          const userSubscibedTo = context.loaders.userSubscribedTo.load(source.id)
          return userSubscibedTo
        }
      },
      subscribedToUser: {
        type: new graphql.GraphQLList(UserType),
        resolve: async(source, args, context) => {
          if(context.data.subs){
            return context.data.subs.get(source.id)
          }
          const userSubscibers = context.loaders.userSubscribers.load(source.id)
          return userSubscibers
        }
      }
    }),
  })
} 

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