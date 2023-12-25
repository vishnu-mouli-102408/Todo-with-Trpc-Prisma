import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc/trpc";

export const isLoggedIn = middleware(async (opts) => {
  const { ctx } = opts;
  // console.log("CTX IN MIDDLEWARE", opts.ctx.userId);

  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  let user = await opts.ctx.prisma.user.findUnique({
    where: {
      id: opts.ctx.userId,
    },
  });
  return opts.next({
    ctx: {
      user,
    },
  });
});
