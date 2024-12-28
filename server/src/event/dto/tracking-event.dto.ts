import { IsNotEmpty, IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDetails {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsOptional()
  @IsString()
  building?: string;
}

export class TrackingEventDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  device_id: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  timestamp: number;

  @IsNumber()
  accuracy: number;

  @IsNumber()
  battery: number;

  @ValidateNested()
  @Type(() => LocationDetails)
  location_details: LocationDetails;

  @IsString()
  connection_type: 'wifi' | 'cellular' | 'bluetooth';

  @IsNumber()
  signal_strength: number;

  @IsNumber()
  movement_speed: number;
}
