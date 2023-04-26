//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotNaturerecordDto } from '../dtos/create-Iotnaturerecord.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class Iot_naturerecord extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  boardIdx: number;

  @Column()
  currentTemp: string;

  @Column()
  currentHumid: string;

  @Column()
  type: number; //1. refresh, 2. auto

  static from({
    boardIdx,
    currentTemp,
    currentHumid,
    type,
  }: {
    boardIdx: number;
    currentTemp: string;
    currentHumid: string;
    type: number;
  }) {
    const iot_naturerecord = new Iot_naturerecord();
    iot_naturerecord.boardIdx = boardIdx;
    iot_naturerecord.currentTemp = currentTemp;
    iot_naturerecord.currentHumid = currentHumid;
    iot_naturerecord.type = type;
    return iot_naturerecord;
  }

  static fromDto(dto: CreateIotNaturerecordDto) {
    const iot_naturerecord = new Iot_naturerecord();
    iot_naturerecord.boardIdx = dto.boardIdx;
    iot_naturerecord.currentTemp = dto.currentTemp;
    iot_naturerecord.currentHumid = dto.currentHumid;
    iot_naturerecord.type = dto.type;

    return iot_naturerecord;
  }
}
