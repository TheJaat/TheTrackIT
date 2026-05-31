import { Body, Controller, Delete, Get, Post, Param, UseGuards} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('devices')
export class DevicesController {
    constructor(private service: DevicesService) { }

    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('ADMIN')
    @Post()
    create(@Body() dto: CreateDeviceDto) {
        return this.service.create(dto);
    }

    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('ADMIN')
    @Delete(':id')
    remove(
        @Param('id') id: string,
    ) {
        return this.service.remove(id);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
    ) {
        return this.service.findOne(id);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    // @Get(':deviceCode')
    // findOne(@Param('deviceCode') deviceCode: string) {
    //     return this.service.findByCode(deviceCode);
    // }

    @Get('code/:deviceCode')
    findByCode(@Param('deviceCode') deviceCode: string) {
        return this.service.findByCode(deviceCode);
    }

    @Get(':deviceCode/qr')
    getQr(@Param('deviceCode') deviceCode: string) {
        return this.service.getDeviceWithQr(deviceCode);
    }
}