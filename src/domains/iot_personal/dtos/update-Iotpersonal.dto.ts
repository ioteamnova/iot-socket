//import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateIotPersonalDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cageName: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // boardSerial: string;
  
  @IsOptional()
  @IsBoolean()
  currentLight: boolean;

  @IsOptional()
  @IsBoolean()
  autochkLight: boolean;

  @IsOptional()
  @IsBoolean()
  autochkWaterpump: boolean;

  @IsOptional()
  @IsBoolean()
  autochkCoolingfan: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentTemp: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  current2Temp: string;

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
  current2Humid: string;

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
}


  // // @ApiProperty({
  // //   description: '이메일',
  // //   default: 'asd123qwe@gmail.com',
  // // })
  // @IsEmail()
  // @IsOptional()
  // email: string;

  // // @ApiProperty({
  // //   description: '닉네임',
  // //   default: '김수정',
  // // })
  // @IsString()
  // @IsOptional()
  // @MaxLength(32)
  // nickname: string;

  // // @ApiProperty({
  // //   description: '프로필 이미지 url',
  // //   default: 'https://image.xxx.xx/xx...',
  // // })
  // @IsString()
  // @IsOptional()
  // profilePath: string;
