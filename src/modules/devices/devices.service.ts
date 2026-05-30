import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    deviceCode: string;
    name: string;
    brand: string;
    model: string;
    serialNumber?: string;
  }) {
    return this.prisma.device.create({ data });
  }

  async findAll() {
    return this.prisma.device.findMany({
      include: {
        allocations: {
          where: { status: 'ACTIVE' },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }
}