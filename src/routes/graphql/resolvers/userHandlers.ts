import graphql from "graphql";
import { UUIDType } from "../types/gqlTypes/uuid.js";
import { ChangeUserInput, CreateUserInput,  UserType } from "../types/gqlTypes/user.js";
import * as gqlResolveInfo from 'graphql-parse-resolve-info';
import {User, UserInput } from "../types/user.js";
import { Context } from "../types/context.js";

const user: graphql.GraphQLFieldConfig<User, Context, UserInput> = {
  type: UserType,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }, context) => {
    const user = await context.prisma.user.findFirst({
      where: {
        id: id
      },
    });
    return user;
  },
}

const users: graphql.GraphQLFieldConfig<User, Context, UserInput> = {
  type: new graphql.GraphQLList(UserType),
  resolve: async (source, agrs, context, resolveInfo) => {
    const parsedResolveInfoFragment = gqlResolveInfo.parseResolveInfo(resolveInfo);

    const simplifiedFragment = gqlResolveInfo.simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as gqlResolveInfo.ResolveTree,
      new graphql.GraphQLNonNull(UserType)
    );
    const isUserSubscribedToField: boolean = simplifiedFragment.fields['userSubscribedTo'] !== undefined 
    const isUserSubscribersToField: boolean = simplifiedFragment.fields['subscribedToUser'] !== undefined
    
    const users = await context.prisma.user.findMany({
      include: {
        userSubscribedTo: isUserSubscribedToField,
        subscribedToUser: isUserSubscribersToField, 
      }     
    });
    
    if(isUserSubscribersToField) {
      const userSubs = new Map();
      users.map((user) => userSubs.set(user.id, user.subscribedToUser.map((sub) => {
        const subId = sub.subscriberId;
        return users.find((user) => user.id === subId);
        })));
        
      for(const key of userSubs.keys()) {
        context.loaders.userSubscribers.prime(key as string,  userSubs.get(key) as User[]);
      }
    }

    if(isUserSubscribedToField) {
      const userSubsTo = new Map();
      users.map((user) => userSubsTo.set(user.id, user.userSubscribedTo.map((sub) => {
        const authorId = sub.authorId;
        return users.find((user) => user.id === authorId);
      })));
      for(const key of userSubsTo.keys()) {
        context.loaders.userSubscribedTo.prime(key as string,  userSubsTo.get(key) as User[]);
      }
    }
    return users;
  },
}


const createUser: graphql.GraphQLFieldConfig<User,Context, UserInput> = {
  type: new graphql.GraphQLNonNull(UserType),
  args: {
    dto: { type: new graphql.GraphQLNonNull(CreateUserInput) },
  },
  resolve: async (_, {dto}, context) => {
    return context.prisma.user.create({data: dto});
  }
};

const changeUser: graphql.GraphQLFieldConfig<User,Context, UserInput> = {
  type: new graphql.GraphQLNonNull(UserType),
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
    dto: { type: new graphql.GraphQLNonNull(ChangeUserInput)}
  },
  resolve: async (_, {id, dto}, context) => {
    return await context.prisma.user.update({
      where: {
        id: id
      },
      data: dto
    });
  }
};

const deleteUser: graphql.GraphQLFieldConfig<User,Context, UserInput> ={
  type: graphql.GraphQLBoolean,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, {id}, context) => {
    try {
      await context.prisma.user.delete({
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


const subscribeTo: graphql.GraphQLFieldConfig<User,Context, UserInput> = {
  type: new graphql.GraphQLNonNull(UserType),
  args: {
    userId: { type: new graphql.GraphQLNonNull(UUIDType) },
    authorId: {type: new graphql.GraphQLNonNull(UUIDType)}
  },
  resolve: async (_, {userId, authorId}, context) => {
    await context.prisma.subscribersOnAuthors.create({
      data: {
        subscriberId: userId,
        authorId: authorId,
      }
    })
    return await context.prisma.user.findFirst({
      where: {
        id: userId
      }
    })
  }
};

const unsubscribeFrom: graphql.GraphQLFieldConfig<User,Context, UserInput> = {
  type: graphql.GraphQLBoolean,
  args: {
    userId: { type: new graphql.GraphQLNonNull(UUIDType) },
    authorId: {type: new graphql.GraphQLNonNull(UUIDType)}
  },
  resolve: async (_, args, context) => {
    await context.prisma.subscribersOnAuthors.deleteMany({
      where: {
        subscriberId: args.userId,
        authorId: args.authorId
      }
    })
    return true;
  }
}

export const UserQueries = {
  user,
  users,
}

export const UserMutations = {
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
}