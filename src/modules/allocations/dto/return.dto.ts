import { IsString } from 'class-validator';

export class ReturnDeviceDto {
  @IsString()
  deviceId: string;

  @IsString()
  userId: string;
}