import graphql from "graphql";
import { UUIDType } from "../types/uuid.js";
import { MemberType } from "./memberType.js";
import { UserType } from "./user.js";
import { PrismaClient } from "@prisma/client";
import { MemberTypeId } from "./memberTypeId.js";

export let ProfileType: graphql.GraphQLObjectType;
export function createProfileType(prisma: PrismaClient) {
  ProfileType = new graphql.GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: {type: new graphql.GraphQLNonNull(UUIDType)},
      isMale: {type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean)},
      yearOfBirth: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
      userId: {type: new graphql.GraphQLNonNull(UUIDType)},
      user: {
        type: UserType,
        resolve: (parent) => {
          return prisma.user.findFirst({
            where: {
              id: parent.userId
            }
          })
        }
      },
      memberTypeId: {type: new graphql.GraphQLNonNull(MemberTypeId)},
      memberType: {
        type: MemberType,
        resolve: async (source, args, context) => {
          const memberType = await context.loaders.memberTypeLoader.load(source.memberTypeId)
          return memberType 
        }
      }
    }),
  })
}


export const CreateProfileInput = new graphql.GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: {type: new graphql.GraphQLNonNull(UUIDType)},
    memberTypeId: {type: new graphql.GraphQLNonNull(MemberTypeId)},
    isMale: {type: graphql.GraphQLBoolean},
    yearOfBirth: {type: graphql.GraphQLInt},
  },
})

export const ChangeProfileInput = new graphql.GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields:() => ({
    isMale: {type: graphql.GraphQLBoolean},
    yearOfBirth: {type: graphql.GraphQLInt},
  }),
})