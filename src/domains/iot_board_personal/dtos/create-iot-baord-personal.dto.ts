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

export class CreateIotBoardPersonalDto {
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
  currentLight: boolean;

  @IsOptional()
  @IsBoolean()
  autoChkLight: boolean;

  @IsOptional()
  @IsBoolean()
  autoChkTemp: boolean;

  @IsOptional()
  @IsBoolean()
  autoChkHumid: boolean;

  @IsNotEmpty()
  @IsString()
  currentTemp: string;

  @IsNotEmpty()
  @IsString()
  currentTemp2: string;

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
  currentHumid2: string;


  @IsNotEmpty()
  @IsString()
  maxHumid: string;

  @IsNotEmpty()
  @IsString()
  minHumid: string;

  @IsNotEmpty()
  @IsString()
  usage: string;

  @IsNotEmpty()
  @IsString()
  autoLightUtctimeOn: string;

  @IsNotEmpty()
  @IsString()
  autoLightUtctimeOff: string;
}
