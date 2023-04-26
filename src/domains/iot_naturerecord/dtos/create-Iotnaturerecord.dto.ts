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

export class CreateIotNaturerecordDto {
  @IsNotEmpty()
  @IsNumber()
  boardIdx: number;

  @IsNotEmpty()
  @IsString()
  currentTemp: string;

  @IsNotEmpty()
  @IsString()
  currentHumid: string;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}
