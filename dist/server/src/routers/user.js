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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("../trpc/trpc");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const server_1 = require("@trpc/server");
const user_1 = require("../middlewares/user");
exports.userRouter = (0, trpc_1.router)({
    signup: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }))
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let email = opts.input.email;
        let password = opts.input.password;
        let response = yield opts.ctx.prisma.user.create({
            data: {
                email,
                password,
            },
        });
        let userId = response.id;
        const token = jsonwebtoken_1.default.sign({ userId: userId }, __1.SECRET, {
            expiresIn: "1h",
        });
        return {
            token,
        };
    })),
    login: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }))
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield opts.ctx.prisma.user.findFirst({
            where: {
                email: opts.input.email,
            },
        });
        if (!user) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, __1.SECRET, {
            expiresIn: "1h",
        });
        return {
            token,
        };
    })),
    me: trpc_1.publicProcedure
        .output(zod_1.z.object({
        email: zod_1.z.string(),
    }))
        .use(user_1.isLoggedIn)
        .query((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield opts.ctx.prisma.user.findFirst({
            where: {
                id: opts.ctx.userId,
            },
        });
        if (!response) {
            // shouldn't happen
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        }
        return {
            email: response.email || "",
        };
    })),
});
