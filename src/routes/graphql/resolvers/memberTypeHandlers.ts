import { PrismaClient } from "@prisma/client";
import  graphql  from "graphql";
import { MemberType } from "../types/memberType.js";
import { MemberTypeId } from "../types/memberTypeId.js";

export const MemberTypeQueries = (prisma: PrismaClient) => {
  return {
    memberType: {
      type: MemberType,
      args: {
        id: { type: new graphql.GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_, { id }) => {
        return await prisma.memberType.findFirst({
          where: {
            id: id
          }
        });
      },
    },
    memberTypes: {
      type: new graphql.GraphQLList(MemberType),
      resolve: async () => {
        return await prisma.memberType.findMany();
        }
    }
  }
  
}