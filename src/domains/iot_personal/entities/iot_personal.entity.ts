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
  currentLight: boolean;

  @Column()
  autochkLight: boolean;

  @Column()
  autochkWaterpump: boolean;

  @Column()
  autochkCoolingfan: boolean;

  @Column()
  currentTemp: string;
  @Column()
  current2Temp: string;

  @Column()
  maxTemp: string;
  @Column()
  minTemp: string;

  @Column()
  currentHumid: string;
  @Column()
  current2Humid: string;

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
    currentLight,
    autochkLight,
    autochkWaterpump,
    autochkCoolingfan,
    currentTemp,
    current2Temp,
    maxTemp,
    minTemp,
    currentHumid,
    current2Humid,
    maxHumid,
    minHumid,
    usage,
  }: {
    userIdx: number;
    petIdx: number;
    cageName: string;
    currentLight: boolean;
    autochkLight: boolean;
    autochkWaterpump: boolean;
    autochkCoolingfan: boolean;
    currentTemp: string;
    current2Temp: string;
    maxTemp: string;
    minTemp: string;
    currentHumid: string;
    current2Humid: string;
    maxHumid: string;
    minHumid: string;
    usage: string;
  }) {
    const iot_person = new Iot_personal();
    iot_person.userIdx = userIdx;
    iot_person.petIdx = petIdx;
    iot_person.cageName = cageName;
    iot_person.currentLight = currentLight;
    iot_person.autochkLight = autochkLight;
    iot_person.autochkWaterpump = autochkWaterpump;
    iot_person.autochkCoolingfan = autochkCoolingfan;
    iot_person.currentTemp = currentTemp;
    iot_person.current2Temp = current2Temp;
    iot_person.maxTemp = maxTemp;
    iot_person.minTemp = minTemp;
    iot_person.currentHumid = currentHumid;
    iot_person.current2Humid = current2Humid;
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
    iot_personal.currentLight = dto.currentLight;
    iot_personal.autochkLight = dto.autochkLight;
    iot_personal.autochkWaterpump = dto.autochkWaterpump;
    iot_personal.autochkCoolingfan = dto.autochkCoolingfan;
    iot_personal.currentTemp = dto.currentTemp;
    iot_personal.current2Temp = dto.current2Temp;
    iot_personal.maxTemp = dto.maxTemp;
    iot_personal.minTemp = dto.minTemp;
    iot_personal.currentHumid = dto.currentHumid;
    iot_personal.current2Humid = dto.current2Humid;
    iot_personal.maxHumid = dto.maxHumid;
    iot_personal.minHumid = dto.minHumid;
    iot_personal.usage = dto.usage;


    //user.password = hashPassword(dto.password);
    return iot_personal;
  }

  updateFromDto(dto: UpdateIotPersonalDto) {
    this.cageName = dto.cageName;
    this.currentLight = dto.currentLight;
    this.autochkLight = dto.autochkLight;
    this.autochkWaterpump = dto.autochkWaterpump;
    this.autochkCoolingfan = dto.autochkCoolingfan;
    this.currentTemp = dto.currentTemp;
    this.current2Temp = dto.current2Temp;
    this.maxTemp = dto.maxTemp;
    this.minTemp = dto.minTemp;
    this.currentHumid = dto.currentHumid;
    this.current2Humid = dto.current2Humid;
    this.maxHumid = dto.maxHumid;
    this.minHumid = dto.minHumid;
    this.usage = dto.usage;

    // console.log("updateBoard::3");
    // console.log(dto);
  }
}
