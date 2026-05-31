import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get('count')
    async count() {
        return this.usersService.countUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req: any) {
        return req.user;
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }
}
