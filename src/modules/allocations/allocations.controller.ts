import { Body, Controller, Post } from '@nestjs/common';
import { AllocationsService } from './allocations.service';
import { AllocateDeviceDto } from './dto/allocation.dto';
import { ReturnDeviceDto } from './dto/return.dto';

@Controller('allocations')
export class AllocationsController {
    constructor(private service: AllocationsService) { }

    @Post('allocate')
    allocate(@Body() dto: AllocateDeviceDto) {
        return this.service.allocate(dto.userId, dto.deviceId);
    }

    @Post('return')
    returnDevice(@Body() dto: ReturnDeviceDto) {
        return this.service.returnDevice(dto.userId, dto.deviceId);
    }
}
