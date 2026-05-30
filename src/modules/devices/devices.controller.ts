import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
    constructor(private service: DevicesService) { }

    @Post()
    create(@Body() dto: CreateDeviceDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':deviceCode')
    findOne(@Param('deviceCode') deviceCode: string) {
        return this.service.findByCode(deviceCode);
    }

    @Get('code/:deviceCode')
    findByCode(@Param('deviceCode') deviceCode: string) {
        return this.service.findByCode(deviceCode);
    }

    @Get(':deviceCode/qr')
    getQr(@Param('deviceCode') deviceCode: string) {
        return this.service.getDeviceWithQr(deviceCode);
    }
}