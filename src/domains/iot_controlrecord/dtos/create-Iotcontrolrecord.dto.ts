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

export class CreateIotControlrecordDto {
  @IsNotEmpty()
  @IsNumber()
  boardIdx: number;

  @IsNotEmpty()
  @IsNumber()
  light: boolean;

  @IsNotEmpty()
  @IsNumber()
  waterpump: boolean;

  @IsNotEmpty()
  @IsNumber()
  coolingfan: boolean;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}
