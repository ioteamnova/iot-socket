//import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Matches,
  MaxLength,
} from 'class-validator';
//import { PasswordRegex } from 'src/utils/password.utils';

export class CreateIotControlrecordDto {
  @IsNotEmpty()
  @IsNumber()
  boardIdx: number;

  @IsNotEmpty()
  @IsNumber()
  uvbLight: number;

  @IsNotEmpty()
  @IsNumber()
  heatingLight: number;


  @IsNotEmpty()
  @IsNumber()
  waterPump: number;

  @IsNotEmpty()
  @IsNumber()
  coolingFan: number;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}
