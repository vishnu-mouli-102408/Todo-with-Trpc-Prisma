import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/src/index";
//     👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
      // async headers() {
      //   return {
      //     Authorization:
      //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMzUwMjgzMCwiZXhwIjoxNzAzNTA2NDMwfQ.1qj4MGk88hrltJ6ons1asyPBN66bfuIwx4dpzGuiSPc",
      //   };
      // },
    }),
  ],
});

async function main() {
  // let response = await trpc.todo.todoCreate.mutate({
  //   title: "Second Todo Title",
  //   content: "Second Todo Content",
  // });

  // let response = await trpc.user.me.query()

  let response = await trpc.todo.todoGet.query();

  console.log({ response });
}
main();
