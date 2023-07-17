import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {  createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import graphql from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createDataLoaders } from './loaders/commonLoader.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

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
export default plugin;