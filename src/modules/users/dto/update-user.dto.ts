import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
}