//import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateIotAuthinfoDto {

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  boardIdx: number;
  
  // @IsOptional()
  // @IsBoolean()
  // currentLight: boolean;

  // @IsOptional()
  // @IsBoolean()
  // autochkLight: boolean;

  // @IsOptional()
  // @IsBoolean()
  // autochkWaterpump: boolean;

  // @IsOptional()
  // @IsBoolean()
  // autochkCoolingfan: boolean;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // currentTemp: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // current2Temp: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // maxTemp: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // minTemp: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // currentHumid: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // current2Humid: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // maxHumid: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // minHumid: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // usage: string;
}
