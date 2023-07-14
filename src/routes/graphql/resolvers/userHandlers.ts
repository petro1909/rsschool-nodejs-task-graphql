import { PrismaClient } from "@prisma/client";
import  graphql from "graphql";
import { UUIDType } from "../types/uuid.js";
import { ChangeUserInput, CreateUserInput,  UserType } from "../types/user.js";


export const UserQueries = {
  user: {
    type: UserType,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }) => {
      return await new PrismaClient().user.findFirst({
        where: {
          id: id
        },
      });
    },
  },
  users: {
    type: new graphql.GraphQLList(UserType),
    resolve: async () => {  
      return await new PrismaClient().user.findMany();
    },
    
  }
}

export const UserMutations = {
  createUser: {
    type: UserType,
    args: {
      dto: { type: new graphql.GraphQLNonNull(CreateUserInput) },
    },
    resolve: async (_, {dto}) => {
      return new PrismaClient().user.create({data: dto});
    }
  },
  changeUser: {
    type: UserType,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
      dto: { type: new graphql.GraphQLNonNull(ChangeUserInput)}
    },
    resolve: async (_, {id, dto}) => {
      return await new PrismaClient().user.update({
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
        await new PrismaClient().user.delete({
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

export const UserSubscriptions = {
  subscribeTo: {
    type: UserType,
    args: {
      userId: { type: new graphql.GraphQLNonNull(UUIDType) },
      authorId: {type: new graphql.GraphQLNonNull(UUIDType)}
    },
    resolve: async (_, {userId, authorId}) => {
      await new PrismaClient().subscribersOnAuthors.create({
        data: {
          subscriberId: userId,
          authorId: authorId,
        }
      })
      return await new PrismaClient().user.findFirst({
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
      await new PrismaClient().subscribersOnAuthors.deleteMany({
        where: {
          subscriberId: args.userId,
          authorId: args.authorId
        }
      })
      return true;
    }
  }
}