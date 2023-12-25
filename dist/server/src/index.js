"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.SECRET = void 0;
const cors_1 = __importDefault(require("cors"));
exports.SECRET = "SECr3t";
const client_1 = require("@prisma/client");
const trpc_1 = require("./trpc/trpc");
const standalone_1 = require("@trpc/server/adapters/standalone");
const user_1 = require("./routers/user");
const todo_1 = require("./routers/todo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appRouter = (0, trpc_1.router)({
    user: user_1.userRouter,
    todo: todo_1.todoRouter,
});
const jwtVerify = (token, secret) => {
    const response = jsonwebtoken_1.default.verify(token, secret);
    //   console.log({ response });
    return response;
};
const createContext = (opts) => {
    const prisma = new client_1.PrismaClient({ log: ["info", "query"] }); // for logs
    let authHeader = opts.req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log({ token });
        const { userId } = jwtVerify(token, exports.SECRET);
        console.log("RESPONSE", userId);
        console.log("PRINTED");
        if (userId) {
            return {
                prisma,
                userId,
            };
        }
    }
    return {
        prisma,
    };
};
exports.createContext = createContext;
const server = (0, standalone_1.createHTTPServer)({
    router: appRouter,
    middleware: (0, cors_1.default)(),
    createContext: exports.createContext,
});
server.listen(3000);
