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
});
