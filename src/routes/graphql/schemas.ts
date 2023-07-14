import { Type } from '@fastify/type-provider-typebox';
import graphql from 'graphql';
import { MemberTypeQueries } from './resolvers/memberTypeHandlers.js';
import { PostQueries, PostMutations } from './resolvers/postHandlers.js';
import { ProfileQueries, ProfileMutations } from './resolvers/profileHandlers.js';
import { UserQueries, UserMutations, UserSubscriptions } from './resolvers/userHandlers.js';
import { PrismaClient } from '@prisma/client';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};



export const createGraphqlSchema = (prisma: PrismaClient) => {
  const queries = new graphql.GraphQLObjectType({
    name: "Query",
    fields:() => ({
      ...UserQueries(prisma),
      ...PostQueries(prisma),
      ...ProfileQueries(prisma),
      ...MemberTypeQueries(prisma)
    }),
  })
  
  
  const mutations = new graphql.GraphQLObjectType({
    name: "Mutation",
    fields:
      {
        ...UserMutations(prisma),
        ...UserSubscriptions(prisma),
        ...PostMutations(prisma),
        ...ProfileMutations(prisma)
    }
  })
  
  const gqlSchema = new graphql.GraphQLSchema({
    query: queries,
    mutation: mutations,
    
  });

  return gqlSchema;
}
