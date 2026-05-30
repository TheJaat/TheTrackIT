import { IsString, IsOptional } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;
}