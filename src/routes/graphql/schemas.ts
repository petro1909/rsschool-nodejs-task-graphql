import { Type } from '@fastify/type-provider-typebox';
import graphql from 'graphql';
import { MemberTypeQueries } from './resolvers/memberTypeHandlers.js';
import { PostQueries, PostMutations } from './resolvers/postHandlers.js';
import { ProfileQueries, ProfileMutations } from './resolvers/profileHandlers.js';
import { UserQueries, UserMutations, UserSubscriptions } from './resolvers/userHandlers.js';

export const gqlResponse = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponse = {
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

const queries = new graphql.GraphQLObjectType({
  name: "Query",
  fields:() => ({
    ...UserQueries,
    ...PostQueries,
    ...ProfileQueries,
    ...MemberTypeQueries
  }),
})


const mutations = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields:
    {
      ...UserMutations,
      ...UserSubscriptions,
      ...PostMutations,
      ...ProfileMutations
  }
})

export const gqlSchema = new graphql.GraphQLSchema({
  query: queries,
  mutation: mutations,
  
})