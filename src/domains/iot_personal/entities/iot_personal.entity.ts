//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateIotPersonalDto } from '../dtos/create-Iotpersonal.dto';
import { UpdateIotPersonalDto } from '../dtos/update-Iotpersonal.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class Iot_personal extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  userIdx: number;

  @Column({
    nullable: false,
    //length: 11,
  })
  petIdx: number;

  @Column({
    nullable: false,
    length: 255,
  })
  cageName: string;

  @Column()
  light: boolean;

  @Column()
  waterpump: boolean;

  @Column()
  coolingfan: boolean;

  @Column()
  currentTemp: string;
  @Column()
  maxTemp: string;
  @Column()
  minTemp: string;

  @Column()
  currentHumid: string;
  @Column()
  maxHumid: string;
  @Column()
  minHumid: string;

  @Column()
  usage: string;

  static from({
    userIdx,
    petIdx,
    cageName,
    light,
    waterpump,
    coolingfan,
    currentTemp,
    maxTemp,
    minTemp,
    currentHumid,
    maxHumid,
    minHumid,
    usage,
  }: {
    userIdx: number;
    petIdx: number;
    cageName: string;
    light: boolean;
    waterpump: boolean;
    coolingfan: boolean;
    currentTemp: string;
    maxTemp: string;
    minTemp: string;
    currentHumid: string;
    maxHumid: string;
    minHumid: string;
    usage: string;
  }) {
    const iot_person = new Iot_personal();
    iot_person.userIdx = userIdx;
    iot_person.petIdx = petIdx;
    iot_person.cageName = cageName;
    iot_person.light = light;
    iot_person.waterpump = waterpump;
    iot_person.coolingfan = coolingfan;
    iot_person.currentTemp = currentTemp;
    iot_person.maxTemp = maxTemp;
    iot_person.minTemp = minTemp;
    iot_person.currentHumid = currentHumid;
    iot_person.maxHumid = maxHumid;
    iot_person.minHumid = minHumid;
    iot_person.usage = usage;
    return iot_person;
  }

  static fromDto(dto: CreateIotPersonalDto) {
    const iot_personal = new Iot_personal();
    iot_personal.userIdx = dto.userIdx;
    iot_personal.petIdx = dto.petIdx;
    iot_personal.cageName = dto.cageName;
    iot_personal.light = dto.light;
    iot_personal.waterpump = dto.waterpump;
    iot_personal.coolingfan = dto.coolingfan;
    iot_personal.currentTemp = dto.currentTemp;
    iot_personal.maxTemp = dto.maxTemp;
    iot_personal.minTemp = dto.minTemp;
    iot_personal.currentHumid = dto.currentHumid;
    iot_personal.maxHumid = dto.maxHumid;
    iot_personal.minHumid = dto.minHumid;
    iot_personal.usage = dto.usage;


    //user.password = hashPassword(dto.password);
    return iot_personal;
  }

  updateFromDto(dto: UpdateIotPersonalDto) {
    this.cageName = dto.cageName;
    this.light = dto.light;
    this.waterpump = dto.waterpump;
    this.coolingfan = dto.coolingfan;
    this.currentTemp = dto.currentTemp;
    this.maxTemp = dto.maxTemp;
    this.minTemp = dto.minTemp;
    this.currentHumid = dto.currentHumid;
    this.maxHumid = dto.maxHumid;
    this.minHumid = dto.minHumid;
    this.usage = dto.usage;

    // console.log("updateBoard::3");
    // console.log(dto);
  }
}
