import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AllocationsService } from './allocations.service';
import { AllocateDeviceDto } from './dto/allocation.dto';
import { ReturnDeviceDto } from './dto/return.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('allocations')
export class AllocationsController {
    constructor(private service: AllocationsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('allocate')
    allocate(
        @Body('deviceId') deviceId: string,
        @CurrentUser() user: any,
    ) {
        return this.service.allocate(user.userId, deviceId);
    }

    @Post('return')
    returnDevice(@Body() dto: ReturnDeviceDto) {
        return this.service.returnDevice(dto.userId, dto.deviceId);
    }
}
