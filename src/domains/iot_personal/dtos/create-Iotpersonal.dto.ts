//import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Matches,
  MaxLength,
} from 'class-validator';
//import { PasswordRegex } from 'src/utils/password.utils';

export class CreateIotPersonalDto {
  @IsNotEmpty()
  @IsNumber()
  userIdx: number;

  @IsNotEmpty()
  @IsNumber()
  petIdx: number;

  @IsNotEmpty()
  @IsString()
  cageName: string;
  
  @IsOptional()
  @IsBoolean()
  light: boolean;

  @IsOptional()
  @IsBoolean()
  waterpump: boolean;

  @IsOptional()
  @IsBoolean()
  coolingfan: boolean;

  @IsNotEmpty()
  @IsString()
  currentTemp: string;

  @IsNotEmpty()
  @IsString()
  current2Temp: string;

  @IsNotEmpty()
  @IsString()
  maxTemp: string;

  @IsNotEmpty()
  @IsString()
  minTemp: string;

  @IsNotEmpty()
  @IsString()
  currentHumid: string;

  @IsNotEmpty()
  @IsString()
  current2Humid: string;


  @IsNotEmpty()
  @IsString()
  maxHumid: string;

  @IsNotEmpty()
  @IsString()
  minHumid: string;

  @IsNotEmpty()
  @IsString()
  usage: string;
}
