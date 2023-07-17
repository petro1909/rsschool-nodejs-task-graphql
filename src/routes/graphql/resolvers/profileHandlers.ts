import  graphql  from "graphql";
import { UUIDType } from "../types/gqlTypes/uuid.js";
import { CreateProfileInput, ChangeProfileInput, ProfileType } from "../types/gqlTypes/profile.js";
import { Profile, ProfileInput } from "../types/profile.js";
import { Context } from "../types/context.js";

const profile: graphql.GraphQLFieldConfig<Profile, Context, ProfileInput> = {
  type: ProfileType,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }, context) => {
    return await context.prisma.profile.findFirst({
      where: {
        id: id
      },
    });
  },
};
const profiles: graphql.GraphQLFieldConfig<Profile, Context, ProfileInput> = {
  type: new graphql.GraphQLList(ProfileType),
  resolve: async (_, args, context) => {
    return await context.prisma.profile.findMany({
    });
  }
}


const createProfile: graphql.GraphQLFieldConfig<Profile, Context, ProfileInput> = {
  type: new graphql.GraphQLNonNull(ProfileType),
  args: {
    dto: { type: new graphql.GraphQLNonNull(CreateProfileInput) },
  },
  resolve: async (_, {dto}, context) => {
    return context.prisma.profile.create({data: dto});
  }
};
const changeProfile: graphql.GraphQLFieldConfig<Profile, Context, ProfileInput> = {
  type: new graphql.GraphQLNonNull(ProfileType),
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
    dto: { type: new graphql.GraphQLNonNull(ChangeProfileInput)}
  },
  resolve: async (_, {id, dto}, context) => {
    return await context.prisma.profile.update({
      where: {
        id: id
      },
      data: dto
    });
  }
};
const deleteProfile: graphql.GraphQLFieldConfig<Profile, Context, ProfileInput> ={
  type: graphql.GraphQLBoolean,
  args: {
    id: { type: new graphql.GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, {id}, context) => {
    try {
      await context.prisma.profile.delete({
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


export const ProfileQueries = { 
  profile,
  profiles
}

export const ProfileMutations = {
  createProfile,
  changeProfile,
  deleteProfile
}