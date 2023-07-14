import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponse, gqlResponse, gqlSchema } from './schemas.js';
import graphql from 'graphql';
import depthLimit from 'graphql-depth-limit';


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
      
      const result = await graphql.graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables
      })
      // console.log(result.data);
      // console.log(result.errors);
      return {data: result.data, errors: result.errors};
    },
  });
}
export default plugin;