import graphql from "graphql";
import { MemberTypeId } from "./memberTypeId.js";
import { ProfileType } from "./profile.js";
import { PrismaClient } from "@prisma/client";

export const MemberType = new graphql.GraphQLObjectType({
  name: 'MemberType',
  fields:() => ({
    id: {type: MemberTypeId},
    discount: {type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)},
    postsLimitPerMonth: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
    profiles: {
      type: new graphql.GraphQLList(ProfileType),
      resolve: async(source) => {
        return await new PrismaClient().profile.findMany({
          where: {
            memberTypeId: source.id
          }
        })
      }
    }
  }),
})