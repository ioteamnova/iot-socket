import {
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateIotEmergencyDto {
  @IsNotEmpty()
  @IsNumber()
  boardIdx: number;

  @IsNotEmpty()
  @IsNumber()
  module: number;

  @IsNotEmpty()
  @IsString()
  limit: string;

  @IsNotEmpty()
  @IsString()
  currentTemp: string;

  @IsNotEmpty()
  @IsString()
  currentHumid: string;

  @IsNotEmpty()
  @IsString()
  currentTemp2: string;

  @IsNotEmpty()
  @IsString()
  currentHumid2: string;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}
