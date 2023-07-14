import { PrismaClient } from "@prisma/client";
import  graphql  from "graphql";
import { UUIDType } from "../types/uuid.js";
import { CreateProfileInput, ChangeProfileInput, ProfileType } from "../types/profile.js";

export const ProfileQueries = {
  profile:  {
    type: ProfileType,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }) => {
      return await new PrismaClient().profile.findFirst({
        where: {
          id: id
        },
      });
    },
  },
  profiles: {
    type: new graphql.GraphQLList(ProfileType),
    resolve: async () => {
      return await new PrismaClient().profile.findMany({
      });
    }
  }
}

export const ProfileMutations = {
  createProfile: {
    type: ProfileType,
    args: {
      dto: { type: new graphql.GraphQLNonNull(CreateProfileInput) },
    },
    resolve: async (_, {dto}) => {
      return new PrismaClient().profile.create({data: dto});
    }
  },
  changeProfile: {
    type: ProfileType,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
      dto: { type: new graphql.GraphQLNonNull(ChangeProfileInput)}
    },
    resolve: async (_, {id, dto}) => {
      return await new PrismaClient().profile.update({
        where: {
          id: id
        },
        data: dto
      });
    }
  }, 
  deleteProfile: {
    type: graphql.GraphQLBoolean,
    args: {
      id: { type: new graphql.GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, {id}) => {
      try {
        await new PrismaClient().profile.delete({
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