import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AllocationsService {

    constructor(private prisma: PrismaService) { }

    async allocateDevice(userId: string, deviceId: string) {
        return this.prisma.$transaction(async (tx: any) => {
            const device = await tx.device.findUnique({
                where: { id: deviceId },
            });

            if (!device || device.status === 'ALLOCATED') {
                throw new Error('Device not available');
            }

            await tx.device.update({
                where: { id: deviceId },
                data: { status: 'ALLOCATED' },
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

    async returnDevice(allocationId: string) {
        return this.prisma.$transaction(async (tx) => {
            const allocation = await tx.allocation.update({
                where: { id: allocationId },
                data: {
                    status: 'RETURNED',
                    returnedAt: new Date(),
                },
            });

            await tx.device.update({
                where: { id: allocation.deviceId },
                data: {
                    status: 'AVAILABLE',
                },
            });

            return allocation;
        });
    }
}
