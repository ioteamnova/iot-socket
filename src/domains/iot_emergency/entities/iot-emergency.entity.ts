//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { IsType } from 'src/core/entity/enums';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotEmergencyDto } from '../dtos/create-Iotemergency.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class IotEmergency extends BaseEntity {

  @Column({
    nullable: false,
  })
  boardIdx: number;

  @Column({
    nullable: false,
  })
  module: number;

  @Column({
    nullable: false,
  })
  limit: string;

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
    module,
    limit,
    currentTemp,
    currentHumid,
    currentTemp2,
    currentHumid2,
    type,
  }: {
    boardIdx: number;
    module: number;
    limit: string;
    currentTemp: string;
    currentHumid2: string;
    currentTemp2: string;
    currentHumid: string;
    type: number;
  }) {
    const iot_emergency = new IotEmergency();
    iot_emergency.boardIdx = boardIdx;
    iot_emergency.module = module;
    iot_emergency.limit = limit;
    iot_emergency.currentTemp = currentTemp;
    iot_emergency.currentHumid = currentHumid;
    iot_emergency.currentTemp2 = currentTemp2;
    iot_emergency.currentHumid2 = currentHumid2;
    iot_emergency.type = type;
    return iot_emergency;
  }

  static fromDto(dto: CreateIotEmergencyDto) {
    const iot_emergency = new IotEmergency();
    iot_emergency.boardIdx = dto.boardIdx;
    iot_emergency.module = dto.module;
    iot_emergency.limit = dto.limit;
    iot_emergency.currentTemp = dto.currentTemp;
    iot_emergency.currentHumid = dto.currentHumid;
    iot_emergency.currentTemp2 = dto.currentTemp2;
    iot_emergency.currentHumid2 = dto.currentHumid2;
    iot_emergency.type = dto.type;

    return iot_emergency;
  }
}
