import { publicProcedure, router } from "../trpc/trpc";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { SECRET } from "..";
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middlewares/user";

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      let email = opts.input.email;
      let password = opts.input.password;
      let response = await opts.ctx.prisma.user.create({
        data: {
          email,
          password,
        },
      });
      // console.log("PRISMA SIGNUP RES", response);

      let userId = response.id;
      const token: string = jwt.sign({ userId: userId }, SECRET, {
        expiresIn: "24h",
      });
      // console.log("UserTokenSignup", token);

      return {
        token,
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      let user = await opts.ctx.prisma.user.findFirst({
        where: {
          email: opts.input.email,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const token: string = jwt.sign({ userId: user.id }, SECRET, {
        expiresIn: "24h",
      });
      return {
        token,
      };
    }),
  me: publicProcedure
    .output(
      z.object({
        email: z.string(),
      })
    )
    .use(isLoggedIn)
    .query(async (opts) => {
      let response = await opts.ctx.prisma.user.findFirst({
        where: {
          id: opts.ctx.userId,
        },
      });
      if (!response) {
        // shouldn't happen
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return {
        email: response.email || "",
      };
    }),
});
