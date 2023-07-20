import  graphql  from "graphql";
import { MemberType } from "../types/gqlTypes/memberType.js";
import { MemberTypeId } from "../types/gqlTypes/memberTypeId.js";
import { MemberType as MType} from "../types/memberType.js"
import { Context } from "../types/context.js";


const memberType: graphql.GraphQLFieldConfig<MType, Context> = {
  type: MemberType,
  args: {
    id: { type: new graphql.GraphQLNonNull(MemberTypeId) },
  },
  resolve: async (_, { id }, context) => {
    return await context.prisma.memberType.findFirst({
      where: {
        id: id
      }
    });
  },
};
  
const memberTypes: graphql.GraphQLFieldConfig<MType, Context> ={
  type: new graphql.GraphQLList(MemberType),
  resolve: async (_, args, context) => {
    return await context.prisma.memberType.findMany();
    }
}

export const MemberTypeQueries = {
  memberType,
  memberTypes,
};