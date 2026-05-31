import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { DeviceQueryDto } from './dto/device-query.dto';

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

    async remove(id: string){
        return "TODO";
    }

    // async findAll() {
    //     return this.prisma.device.findMany({
    //         include: {
    //             currentUser: {
    //                 select: {
    //                     id: true,
    //                     name: true,
    //                     email: true,
    //                 },
    //             },
    //         },
    //         orderBy: {
    //             createdAt: 'desc',
    //         },
    //     });
    // }

    async findAll(query: DeviceQueryDto) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 20);

        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.brand) {
            where.brand = query.brand;
        }

        if (query.search) {
            where.OR = [
                {
                    name: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
                {
                    deviceCode: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        const [items, total] =
            await this.prisma.$transaction([
                this.prisma.device.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        currentUser: true,
                    },
                }),
                this.prisma.device.count({
                    where,
                }),
            ]);

        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        return this.prisma.device.findUnique({
            where: {
                id,
            },
            include: {
                currentUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                allocations: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },

                    orderBy: {
                        allocatedAt: 'desc',
                    },
                },
            },
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