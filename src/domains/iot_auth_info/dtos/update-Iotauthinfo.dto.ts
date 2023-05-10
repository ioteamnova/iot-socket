//import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateIotAuthinfoDto {

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  boardIdx: number;
}
