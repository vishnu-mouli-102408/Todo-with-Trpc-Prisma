import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/src/index";
//     👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
      async headers() {
        return {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMzUxMzc1OSwiZXhwIjoxNzAzNjAwMTU5fQ.ypNBLJSJpqRJq5sUJiUNfCoJZCLTP7m5hOm5hqBzWB0",
        };
      },
    }),
  ],
});

async function main() {
  // let response = await trpc.todo.todoCreate.mutate({
  //   title: "Mouli Todo Title",
  //   content: "Mouli Todo Content",
  // });

  // let response = await trpc.user.login.mutate({
  //   email: "vishnumouli1@gmail.com",
  //   password: "iluoM@102408",
  // });

  let response = await trpc.todo.todoUpdate.mutate({
    id: 3,
    data: {
      title: "Updated Mouli Title",
    },
  });

  console.log({ response });
}
main();
