import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DevicesModule } from './modules/devices/devices.module';
import { AllocationsModule } from './modules/allocations/allocations.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    DevicesModule,
    AllocationsModule,PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
