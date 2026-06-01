import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        return this.auth.login(body.email, body.password);
    }

    @Post('register')
    register(
        @Body() dto: RegisterDto,
    ) {
        return this.auth.register(
            dto,
        );
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(
        @CurrentUser() user: any,
    ) {
        return this.auth.getMe(
            user.userId,
        );
    }
}