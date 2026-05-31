import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getStats() {
    const [
      totalDevices,
      totalUsers,
      allocatedDevices,
      availableDevices,
    ] = await Promise.all([
      this.prisma.device.count(),
      this.prisma.user.count(),
      this.prisma.device.count({
        where: {
          status: 'ALLOCATED',
        },
      }),
      this.prisma.device.count({
        where: {
          status: 'AVAILABLE',
        },
      }),
    ]);

    return {
      totalDevices,
      totalUsers,
      allocatedDevices,
      availableDevices,
    };
  }
}