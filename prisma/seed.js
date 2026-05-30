"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt_1.default.hash('test', 10);
    await prisma.user.upsert({
        where: {
            email: 'admin@thejat.in',
        },
        update: {},
        create: {
            name: 'TheJat',
            email: 'admin@thejat.in',
            passwordHash,
            role: client_1.UserRole.ADMIN,
        },
    });
    console.log('Admin user created');
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map