//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotBoardPersonalDto } from '../dtos/create-iot-baord-personal.dto';
import { UpdateIotBoardPersonalDto } from '../dtos/update-iot-board-personal.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class IotBoardPersonal extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  userIdx: number;

  @Column({
    nullable: false,
    //length: 11,
  })
  authIdx: number;

  @Column({
    nullable: false,
    length: 255,
  })
  cageName: string;

  @Column()
  currentUvbLight: number;

  @Column()
  currentHeatingLight: number;

  @Column({
    nullable: false,
  })
  autoChkLight: number;

  @Column({
    nullable: false,
  })
  autoChkTemp: number;

  @Column({
    nullable: false,
  })
  autoChkHumid: number;

  @Column()
  currentTemp: string;

  @Column()
  currentTemp2: string;

  @Column()
  maxTemp: string;

  @Column()
  minTemp: string;

  @Column()
  currentHumid: string;

  @Column()
  currentHumid2: string;

  @Column()
  maxHumid: string;

  @Column()
  minHumid: string;

  @Column({
    nullable: false,
    length: 32,
  })
  usage: string;

  @Column({
    nullable: false,
    length: 32,
  })
  autoLightUtctimeOn: string;

  @Column({
    nullable: false,
    length: 32,
  })
  autoLightUtctimeOff: string;

  static from({
    userIdx,
    authIdx,
    cageName,
    currentUvbLight,
    currentHeatingLight,
    autoChkLight,
    autoChkTemp,
    autoChkHumid,
    currentTemp,
    currentTemp2,
    maxTemp,
    minTemp,
    currentHumid,
    currentHumid2,
    maxHumid,
    minHumid,
    usage,
    autoLightUtctimeOn,
    autoLightUtctimeOff,
  }: {
    userIdx: number;
    authIdx: number;
    cageName: string;
    currentUvbLight: number;
    currentHeatingLight: number;
    autoChkLight: number;
    autoChkTemp: number;
    autoChkHumid: number;
    currentTemp: string;
    currentTemp2: string;
    maxTemp: string;
    minTemp: string;
    currentHumid: string;
    currentHumid2: string;
    maxHumid: string;
    minHumid: string;
    usage: string;
    autoLightUtctimeOn: string;
    autoLightUtctimeOff: string;
  }) {
    const iot_board_personal = new IotBoardPersonal();
    iot_board_personal.userIdx = userIdx;
    iot_board_personal.authIdx = authIdx;
    iot_board_personal.cageName = cageName;
    iot_board_personal.currentUvbLight = currentUvbLight;
    iot_board_personal.currentHeatingLight = currentHeatingLight;
    iot_board_personal.autoChkLight = autoChkLight;
    iot_board_personal.autoChkTemp = autoChkTemp;
    iot_board_personal.autoChkHumid = autoChkHumid;
    iot_board_personal.currentTemp = currentTemp;
    iot_board_personal.currentTemp2 = currentTemp2;
    iot_board_personal.maxTemp = maxTemp;
    iot_board_personal.minTemp = minTemp;
    iot_board_personal.currentHumid = currentHumid;
    iot_board_personal.currentHumid2 = currentHumid2;
    iot_board_personal.maxHumid = maxHumid;
    iot_board_personal.minHumid = minHumid;
    iot_board_personal.usage = usage;
    iot_board_personal.autoLightUtctimeOn = autoLightUtctimeOn;
    iot_board_personal.autoLightUtctimeOff = autoLightUtctimeOff;
    return iot_board_personal;
  }

  static fromDto(dto: CreateIotBoardPersonalDto) {
    const iot_board_personal = new IotBoardPersonal();
    iot_board_personal.userIdx = dto.userIdx;
    iot_board_personal.authIdx = dto.authIdx;
    iot_board_personal.cageName = dto.cageName;
    iot_board_personal.currentUvbLight = dto.currentUvbLight;
    iot_board_personal.currentHeatingLight = dto.currentHeatingLight;
    iot_board_personal.autoChkLight = dto.autoChkLight;
    iot_board_personal.autoChkTemp = dto.autoChkTemp;
    iot_board_personal.autoChkHumid = dto.autoChkHumid;
    iot_board_personal.currentTemp = dto.currentTemp;
    iot_board_personal.currentTemp2 = dto.currentTemp2;
    iot_board_personal.maxTemp = dto.maxTemp;
    iot_board_personal.minTemp = dto.minTemp;
    iot_board_personal.currentHumid = dto.currentHumid;
    iot_board_personal.currentHumid2 = dto.currentHumid2;
    iot_board_personal.maxHumid = dto.maxHumid;
    iot_board_personal.minHumid = dto.minHumid;
    iot_board_personal.usage = dto.usage;
    iot_board_personal.autoLightUtctimeOn = dto.autoLightUtctimeOn;
    iot_board_personal.autoLightUtctimeOff = dto.autoLightUtctimeOff;
    return iot_board_personal;
  }

  updateFromDto(dto: UpdateIotBoardPersonalDto) {
    this.cageName = dto.cageName;
    this.currentUvbLight = dto.currentUvbLight;
    this.currentHeatingLight = dto.currentHeatingLight;
    this.autoChkLight = dto.autoChkLight;
    this.autoChkTemp = dto.autoChkTemp;
    this.autoChkHumid = dto.autoChkHumid;
    this.currentTemp = dto.currentTemp;
    this.currentTemp2 = dto.currentTemp2;
    this.maxTemp = dto.maxTemp;
    this.minTemp = dto.minTemp;
    this.currentHumid = dto.currentHumid;
    this.currentHumid2 = dto.currentHumid2;
    this.maxHumid = dto.maxHumid;
    this.minHumid = dto.minHumid;
    this.usage = dto.usage;
    this.autoLightUtctimeOn = dto.autoLightUtctimeOn;
    this.autoLightUtctimeOff = dto.autoLightUtctimeOff;
  }
}
