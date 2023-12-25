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
const client_1 = require("@trpc/client");
//     👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = (0, client_1.createTRPCProxyClient)({
    links: [
        (0, client_1.httpBatchLink)({
            url: "http://localhost:3000",
            headers() {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMzUxMzc1OSwiZXhwIjoxNzAzNjAwMTU5fQ.ypNBLJSJpqRJq5sUJiUNfCoJZCLTP7m5hOm5hqBzWB0",
                    };
                });
            },
        }),
    ],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // let response = await trpc.todo.todoCreate.mutate({
        //   title: "Mouli Todo Title",
        //   content: "Mouli Todo Content",
        // });
        // let response = await trpc.user.login.mutate({
        //   email: "vishnumouli1@gmail.com",
        //   password: "iluoM@102408",
        // });
        let response = yield trpc.todo.todoUpdate.mutate({
            id: 3,
            data: {
                title: "Updated Mouli Title",
            },
        });
        console.log({ response });
    });
}
main();
