//import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
//import { PasswordRegex } from 'src/utils/password.utils';

export class CreateIotBoardPersonalDto {
  @IsNotEmpty()
  @IsNumber()
  userIdx: number;

  @IsNotEmpty()
  @IsNumber()
  authIdx: number;

  @IsNotEmpty()
  @IsString()
  cageName: string;

  @IsOptional()
  @IsNumber()
  currentUvbLight: number;

  @IsOptional()
  @IsNumber()
  currentHeatingLight: number;

  @IsOptional()
  @IsNumber()
  autoChkLight: number;

  @IsOptional()
  @IsNumber()
  autoChkTemp: number;

  @IsOptional()
  @IsNumber()
  autoChkHumid: number;

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
