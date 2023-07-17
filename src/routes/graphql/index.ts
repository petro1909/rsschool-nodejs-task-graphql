import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {  createGqlResponseSchema, createGraphqlSchema, gqlResponseSchema } from './schemas.js';
import graphql from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { PrismaClient } from '@prisma/client';
import { createUserType } from './types/user.js';
import { createPostType } from './types/post.js';
import { createProfileType } from './types/profile.js';
import { createMemberType } from './types/memberType.js';
import { createDataLoaders } from './loaders/commonLoader.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  createTypes(prisma);
  const gqlSchema = createGraphqlSchema(prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      
      const queryDocumentNode = graphql.parse(req.body.query);
      const validationErrors = graphql.validate(gqlSchema, queryDocumentNode, [depthLimit(5)])
      if(validationErrors && validationErrors.length != 0) {
        return {data: '', errors: validationErrors};
      }

      const result = await graphql.graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          prisma,
          loaders: {
            ...createDataLoaders(prisma),
          },
          data: {},
        }
      })
      console.log(result.errors);
      return {data: result.data, errors: result.errors};
    },
  });
}

function createTypes(prisma: PrismaClient) {
  createUserType(prisma);
  createPostType(prisma);
  createProfileType(prisma);
  createMemberType(prisma);
};

export default plugin;