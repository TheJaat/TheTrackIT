import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return {
      access_token: this.jwt.sign({
        sub: user.id,
        role: user.role,
      }),
    };
  }

    async register(dto: RegisterDto) {
        const existing =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

        if (existing) {
            throw new Error(
                'User already exists',
            );
        }

        const passwordHash =
            await bcrypt.hash(
                dto.password,
                10,
            );

        return this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
            },
        });
    }
}