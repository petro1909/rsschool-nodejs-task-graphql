import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponse, gqlResponse, gqlSchema } from './schemas.js';
import graphql from 'graphql';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponse,
      response: {
        200: gqlResponse,
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
        variableValues: req.body.variables
      })
      return {data: result.data, errors: result.errors};
    },
  });
}
export default plugin;