import { PrismaClient } from "@prisma/client";
import  graphql  from "graphql";
import { MemberType } from "../types/memberType.js";
import { MemberTypeId } from "../types/memberTypeId.js";

export const MemberTypeQueries = {
  memberType: {
    type: MemberType,
    args: {
      id: { type: new graphql.GraphQLNonNull(MemberTypeId) },
    },
    resolve: async (_, { id }) => {
      return await new PrismaClient().memberType.findFirst({
        where: {
          id: id
        }
      });
    },
  },
  memberTypes: {
    type: new graphql.GraphQLList(MemberType),
    resolve: async () => {
      return await new PrismaClient().memberType.findMany();
      }
  }
}