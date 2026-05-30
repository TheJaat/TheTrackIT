import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const count = await this.prisma.device.count();

    return this.prisma.device.create({
      data: {
        ...dto,
        deviceCode: `DEV-${String(count + 1).padStart(4, '0')}`,
      },
    });
  }

  async findAll() {
    return this.prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }
}