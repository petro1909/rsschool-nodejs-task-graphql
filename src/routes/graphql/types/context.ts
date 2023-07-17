import { PrismaClient } from "@prisma/client";
import { createDataLoaders } from "../loaders/commonLoader.js";

export type Context = {
  prisma: PrismaClient,
  loaders: ReturnType<typeof createDataLoaders>,
  data: data;
}
type data = {
  [index: string]: Map<unknown, unknown> | undefined;
}