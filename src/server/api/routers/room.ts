import type { Room } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const room = createTRPCRouter({
  check: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const findRoom: Room | null = await ctx.prisma.room.findFirst({
        where: {
          id: input.roomId,
        },
      });

      if (!findRoom) return { roomFound: false, roomId: "" };
      return { roomFound: true, roomId: findRoom.id };
    }),
  create: publicProcedure.mutation(async ({ ctx }) => {
    const newRoom = await ctx.prisma.room.create({
      data: {
        maxPlayers: 2,
        currentPlayers: 0,
      },
    });

    return {
      id: newRoom.id,
    };
  }),
});
