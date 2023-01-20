import { createTRPCRouter, publicProcedure } from "../trpc";

export const room = createTRPCRouter({
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
