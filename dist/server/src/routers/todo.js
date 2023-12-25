"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRouter = void 0;
const user_1 = require("../middlewares/user");
const trpc_1 = require("../trpc/trpc");
const zod_1 = require("zod");
exports.todoRouter = (0, trpc_1.router)({
    todoCreate: trpc_1.publicProcedure
        .input(zod_1.z.object({
        title: zod_1.z.string(),
        content: zod_1.z.string(),
    }))
        .use(user_1.isLoggedIn)
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let title = opts.input.title;
        let content = opts.input.content;
        const response = yield opts.ctx.prisma.todo.create({
            data: {
                title,
                content,
                authorId: opts.ctx.userId,
            },
        });
        return {
            id: response.id,
        };
    })),
    todoGet: trpc_1.publicProcedure.use(user_1.isLoggedIn).query((opts) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(opts.ctx.userId);
        let todos = yield opts.ctx.prisma.todo.findMany({
            where: {
                authorId: opts.ctx.userId,
            },
        });
        return todos;
    })),
    todoUpdate: trpc_1.publicProcedure
        .input(zod_1.z.object({
        id: zod_1.z.number(),
        data: zod_1.z.object({
            title: zod_1.z.string().optional(),
            content: zod_1.z.string().optional(),
            done: zod_1.z.boolean().optional(),
        }),
    }))
        .use(user_1.isLoggedIn)
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield opts.ctx.prisma.todo.update({
            where: {
                id: opts.input.id,
                authorId: opts.ctx.userId,
            },
            data: opts.input.data,
        });
        return response;
    })),
    todoDelete: trpc_1.publicProcedure
        .input(zod_1.z.object({
        id: zod_1.z.number(),
    }))
        .use(user_1.isLoggedIn)
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield opts.ctx.prisma.todo.delete({
            where: {
                id: opts.input.id,
                authorId: opts.ctx.userId,
            },
        });
        return response;
    })),
});
