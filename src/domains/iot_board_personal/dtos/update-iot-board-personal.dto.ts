//import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateIotBoardPersonalDto {

  @IsOptional()
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

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentTemp: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentTemp2: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  maxTemp: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  minTemp: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentHumid: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentHumid2: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  maxHumid: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  minHumid: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  usage: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  autoLightUtctimeOn: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  autoLightUtctimeOff: string;
}

