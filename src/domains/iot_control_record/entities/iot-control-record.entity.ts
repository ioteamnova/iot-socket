//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { IsType } from 'src/core/entity/enums';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotControlrecordDto } from '../dtos/create-Iotcontrolrecord.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class IotControlRecord extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  boardIdx: number;

  @Column()
  uvbLight: number;

  @Column()
  heatingLight: number;

  @Column()
  waterPump: number;

  @Column()
  coolingFan: number;

  @Column({ type: 'enum', name: 'type', enum: IsType })
  type: number; //1. auto, 2. passive

  static from({
    boardIdx,
    uvbLight,
    heatingLight,
    waterPump,
    coolingFan,
    type,
  }: {
    boardIdx: number;
    uvbLight: number;
    heatingLight: number;
    waterPump: number;
    coolingFan: number;
    type: number;
  }) {
    const iot_controlrecord = new IotControlRecord();
    iot_controlrecord.boardIdx = boardIdx;
    iot_controlrecord.uvbLight = uvbLight;
    iot_controlrecord.heatingLight = heatingLight;
    iot_controlrecord.waterPump = waterPump;
    iot_controlrecord.coolingFan = coolingFan;
    iot_controlrecord.type = type;
    return iot_controlrecord;
  }

  static fromDto(dto: CreateIotControlrecordDto) {
    const iot_controlrecord = new IotControlRecord();
    iot_controlrecord.boardIdx = dto.boardIdx;
    iot_controlrecord.uvbLight = dto.uvbLight;
    iot_controlrecord.heatingLight = dto.heatingLight;
    iot_controlrecord.waterPump = dto.waterPump;
    iot_controlrecord.coolingFan = dto.coolingFan;
    iot_controlrecord.type = dto.type;

    return iot_controlrecord;
  }
}
