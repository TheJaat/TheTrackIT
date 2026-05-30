import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class DevicesService {
    constructor(private prisma: PrismaService) { }

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
            include: {
                currentUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.device.findUnique({
            where: { id },
        });
    }

    async findByCode(deviceCode: string) {
        return this.prisma.device.findUnique({
            where: { deviceCode },
            include: {
                allocations: {
                    orderBy: { allocatedAt: 'desc' },
                    take: 1,
                },
            },
        });
    }


    async getDeviceWithQr(deviceCode: string) {
        const device = await this.prisma.device.findUnique({
            where: { deviceCode },
        });

        if (!device) return null;

        const qr = await QRCode.toDataURL(
            `http://localhost:3000/devices/${deviceCode}`
        );

        return {
            ...device,
            qr, // base64 image
        };
    }
}