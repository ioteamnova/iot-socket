//import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateIotBoardPersonalDto {

  @IsOptional()
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

