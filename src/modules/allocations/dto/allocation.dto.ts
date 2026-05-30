import { IsString } from 'class-validator';

export class AllocateDeviceDto {
  @IsString()
  userId: string;

  @IsString()
  deviceId: string;
}