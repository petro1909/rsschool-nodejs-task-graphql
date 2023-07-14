import { PrismaClient } from "@prisma/client";
import  graphql from "graphql";
import { UUIDType } from "../types/uuid.js";
import { ChangeUserInput, CreateUserInput,  UserType } from "../types/user.js";

export const UserQueries = (prisma: PrismaClient) => {
  return {
    user: {
      type: UserType,
      args: {
        id: { type: new graphql.GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }) => {
        return await prisma.user.findFirst({
          where: {
            id: id
          },
        });
      },
    },
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve: async (_) => { 
        return await prisma.user.findMany();
      },
    }
  }
}

export const UserMutations = (prisma: PrismaClient) => {
  return {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new graphql.GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, {dto}) => {
        return prisma.user.create({data: dto});
      }
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new graphql.GraphQLNonNull(UUIDType) },
        dto: { type: new graphql.GraphQLNonNull(ChangeUserInput)}
      },
      resolve: async (_, {id, dto}) => {
        return await prisma.user.update({
          where: {
            id: id
          },
          data: dto
        });
      }
    }, 
    deleteUser:  {
      type: graphql.GraphQLBoolean,
      args: {
        id: { type: new graphql.GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, {id}) => {
        try {
          await prisma.user.delete({
            where: {
              id: id
            }
          });
          return true;
        } catch(err) {
          return false;
        }
      }
    }
  }
}

export const UserSubscriptions = (prisma: PrismaClient) => {
  return {
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new graphql.GraphQLNonNull(UUIDType) },
        authorId: {type: new graphql.GraphQLNonNull(UUIDType)}
      },
      resolve: async (_, {userId, authorId}) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          }
        })
        return await prisma.user.findFirst({
          where: {
            id: userId
          }
        })
      }
    },
    unsubscribeFrom: {
      type: graphql.GraphQLBoolean,
      args: {
        userId: { type: new graphql.GraphQLNonNull(UUIDType) },
        authorId: {type: new graphql.GraphQLNonNull(UUIDType)}
      },
      resolve: async (_, args) => {
        await prisma.subscribersOnAuthors.deleteMany({
          where: {
            subscriberId: args.userId,
            authorId: args.authorId
          }
        })
        return true;
      }
    }
  }
}