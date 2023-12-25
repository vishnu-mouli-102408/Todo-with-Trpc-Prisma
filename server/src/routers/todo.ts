import { isLoggedIn } from "../middlewares/user";
import { publicProcedure, router } from "../trpc/trpc";
import { z } from "zod";

export const todoRouter = router({
  todoCreate: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .use(isLoggedIn)
    .mutation(async (opts) => {
      let title = opts.input.title;
      let content = opts.input.content;
      const response = await opts.ctx.prisma.todo.create({
        data: {
          title,
          content,
          authorId: opts.ctx.userId!,
        },
      });
      return {
        id: response.id,
      };
    }),
  todoGet: publicProcedure.use(isLoggedIn).query(async (opts) => {
    // console.log(opts.ctx.userId);
    let todos = await opts.ctx.prisma.todo.findMany({
      where: {
        authorId: opts.ctx.userId,
      },
    });
    return todos;
  }),
  todoUpdate: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          done: z.boolean().optional(),
        }),
      })
    )
    .use(isLoggedIn)
    .mutation(async (opts) => {
      let response = await opts.ctx.prisma.todo.update({
        where: {
          id: opts.input.id,
          authorId: opts.ctx.userId,
        },
        data: opts.input.data,
      });
      return response;
    }),
  todoDelete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .use(isLoggedIn)
    .mutation(async (opts) => {
      let response = await opts.ctx.prisma.todo.delete({
        where: {
          id: opts.input.id,
          authorId: opts.ctx.userId,
        },
      });
      return response;
    }),
});
