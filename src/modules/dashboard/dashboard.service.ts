import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async stats() {
        const [
            totalDevices,
            availableDevices,
            allocatedDevices,
            totalUsers,
            activeAllocations,
        ] = await Promise.all([
            this.prisma.device.count(),

            this.prisma.device.count({
                where: {
                    status: 'AVAILABLE',
                },
            }),

            this.prisma.device.count({
                where: {
                    status: 'ALLOCATED',
                },
            }),

            this.prisma.user.count(),

            this.prisma.allocation.count({
                where: {
                    status: 'ACTIVE',
                },
            }),
        ]);

        return {
            totalDevices,
            availableDevices,
            allocatedDevices,
            totalUsers,
            activeAllocations,
        };
    }

    async recentActivity() {
        const allocations =
            await this.prisma.allocation.findMany({
                take: 10,
                orderBy: {
                    allocatedAt: 'desc',
                },
                include: {
                    user: true,
                    device: true,
                },
            });

        return allocations.map(
            (allocation) => ({
                id: allocation.id,
                user:
                    allocation.user.name,
                device:
                    allocation.device.name,
                status:
                    allocation.status,
                allocatedAt:
                    allocation.allocatedAt,
                returnedAt:
                    allocation.returnedAt,
            }),
        );
    }
}