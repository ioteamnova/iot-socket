//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { IsType } from 'src/core/entity/enums';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotNaturerecordDto } from '../dtos/create-Iotnaturerecord.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class IotNatureRecord extends BaseEntity {

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
  currentTemp2: string;

  @Column()
  currentHumid2: string;

  @Column({ type: 'enum', name: 'type', enum: IsType })
  type: number; //1. auto, 2. passive

  static from({
    boardIdx,
    currentTemp,
    currentHumid,
    currentTemp2,
    currentHumid2,
    type,
  }: {
    boardIdx: number;
    currentTemp: string;
    currentHumid2: string;
    currentTemp2: string;
    currentHumid: string;
    type: number;
  }) {
    const iot_nature_record = new IotNatureRecord();
    iot_nature_record.boardIdx = boardIdx;
    iot_nature_record.currentTemp = currentTemp;
    iot_nature_record.currentHumid = currentHumid;
    iot_nature_record.currentTemp2 = currentTemp2;
    iot_nature_record.currentHumid2 = currentHumid2;
    iot_nature_record.type = type;
    return iot_nature_record;
  }

  static fromDto(dto: CreateIotNaturerecordDto) {
    const iot_nature_record = new IotNatureRecord();
    iot_nature_record.boardIdx = dto.boardIdx;
    iot_nature_record.currentTemp = dto.currentTemp;
    iot_nature_record.currentHumid = dto.currentHumid;
    iot_nature_record.currentTemp2 = dto.currentTemp2;
    iot_nature_record.currentHumid2 = dto.currentHumid2;
    iot_nature_record.type = dto.type;

    return iot_nature_record;
  }
}
