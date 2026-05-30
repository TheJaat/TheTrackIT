import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AllocationsService {
    constructor(private prisma: PrismaService) { }

    async allocate(userId: string, deviceId: string) {
        const device = await this.prisma.device.findUnique({
            where: { id: deviceId },
        });

        if (!device) throw new BadRequestException('Device not found');

        if (device.status === 'ALLOCATED') {
            throw new BadRequestException('Device already allocated');
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.device.update({
                where: { id: deviceId },
                data: {
                    status: 'ALLOCATED',
                    currentUserId: userId,
                    allocatedAt: new Date(),
                },
            });

            return tx.allocation.create({
                data: {
                    userId,
                    deviceId,
                    status: 'ACTIVE',
                },
            });
        });
    }

    async returnDevice(userId: string, deviceId: string) {
        const device = await this.prisma.device.findUnique({
            where: { id: deviceId },
        });

        if (!device) {
            throw new BadRequestException('Device not found');
        }

        if (device.currentUserId !== userId) {
            throw new BadRequestException('This user does not hold this device');
        }

        const activeAllocation = await this.prisma.allocation.findFirst({
            where: {
                deviceId,
                userId,
                status: 'ACTIVE',
            },
        });

        if (!activeAllocation) {
            throw new BadRequestException('No active allocation found');
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.allocation.update({
                where: { id: activeAllocation.id },
                data: {
                    status: 'RETURNED',
                    returnedAt: new Date(),
                },
            });

            return tx.device.update({
                where: { id: deviceId },
                data: {
                    status: 'AVAILABLE',
                    currentUserId: null,
                    allocatedAt: null,
                },
            });
        });
    }
}