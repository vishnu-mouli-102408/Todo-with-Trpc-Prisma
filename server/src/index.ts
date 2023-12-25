import cors from "cors";
export const SECRET = "SECr3t";
import { PrismaClient } from "@prisma/client";
import { router } from "./trpc/trpc";
import {
  createHTTPServer,
  CreateHTTPContextOptions,
} from "@trpc/server/adapters/standalone";
import { userRouter } from "./routers/user";
// import { todoRouter } from "./routers/todo";
import jwt from "jsonwebtoken";
const appRouter = router({
  user: userRouter,
  //   todo: todoRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const jwtVerify = (token: string, secret: string) => {
  const response = jwt.verify(token, secret);
  console.log({ response });
  return response;
};

export const createContext = (opts: CreateHTTPContextOptions) => {
  const prisma = new PrismaClient({ log: ["info", "query"] }); // for logs
  let authHeader = opts.req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log({ token });
    const response = jwtVerify(token, SECRET);
    if (response) {
      return {
        prisma,
        response,
      };
    }
  }

  return {
    prisma,
  };
};

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

server.listen(3000);
