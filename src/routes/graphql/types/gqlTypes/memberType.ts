import graphql from "graphql";
import { MemberTypeId } from "./memberTypeId.js";
import { ProfileType } from "./profile.js";
import { MemberType as MType } from "../memberType.js";
import {Context} from "../context.js"

export const MemberType = new graphql.GraphQLObjectType<MType, Context>({
  name: 'MemberType',
  fields:() => ({
    id: {type: MemberTypeId},
    discount: {type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)},
    postsLimitPerMonth: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
    profiles: {
      type: new graphql.GraphQLList(ProfileType),
      resolve: async(source, args, constext) => {
        return await constext.prisma.profile.findMany({
          where: {
            memberTypeId: source.id
          }
        })
      }
    }
  }),
});