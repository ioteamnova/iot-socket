//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotControlrecordDto } from '../dtos/create-Iotcontrolrecord.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class Iot_controlrecord extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  boardIdx: number;

  @Column()
  light: boolean;

  @Column()
  waterpump: boolean;

  @Column()
  coolingfan: boolean;

  @Column()
  type: number; //1. refresh, 2. auto

  static from({
    boardIdx,
    light,
    waterpump,
    coolingfan,
    type,
  }: {
    boardIdx: number;
    light: boolean;
    waterpump: boolean;
    coolingfan: boolean;
    type: number;
  }) {
    const iot_controlrecord = new Iot_controlrecord();
    iot_controlrecord.boardIdx = boardIdx;
    iot_controlrecord.light = light;
    iot_controlrecord.waterpump = waterpump;
    iot_controlrecord.coolingfan = coolingfan;
    iot_controlrecord.type = type;
    return iot_controlrecord;
  }

  static fromDto(dto: CreateIotControlrecordDto) {
    const iot_controlrecord = new Iot_controlrecord();
    iot_controlrecord.boardIdx = dto.boardIdx;
    iot_controlrecord.light = dto.light;
    iot_controlrecord.waterpump = dto.waterpump;
    iot_controlrecord.coolingfan = dto.coolingfan;
    iot_controlrecord.type = dto.type;

    return iot_controlrecord;
  }
}
