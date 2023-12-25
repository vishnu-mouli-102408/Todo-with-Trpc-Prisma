// import { publicProcedure, router } from "../trpc/trpc";
// import { z } from "zod";

// export const todoRouter = router({
//   todoCreate: publicProcedure
//     .input(
//       z.object({
//         title: z.string(),
//         content: z.string(),
//       })
//     )
//     .mutation(async (opts) => {
//       let title = opts.input.title;
//       let content = opts.input.content;
//       const response = await opts.ctx.prisma.todo.create({
//         data: {
//           title,
//           content,
//           authorId: opts.ctx.response,
//         },
//       });
//     }),
// });
