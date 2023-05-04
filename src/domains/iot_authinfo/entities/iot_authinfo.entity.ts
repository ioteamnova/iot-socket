//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { CreateIotPersonalDto } from '../dtos/create-Iotauthinfo.dto';
// import { UpdateIotPersonalDto } from '../dtos/update-Iotauthinfo.dto';
import { UpdateIotAuthinfoDto } from '../dtos/update-Iotauthinfo.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class Iot_authinfo extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  boardIdx: number;

  @Column({
    nullable: false,
    //length: 11,
  })
  userIdx: number;

  @Column({
    nullable: false,
    length: 255,
  })
  boardTempname: string;

  @Column({
    nullable: false,
    length: 255,
  })
  boardSerial: string;

  static from({
    boardIdx,
    userIdx,
    boardTempname,
    boardSerial,
  }: {
    boardIdx: number;
    userIdx: number;
    boardTempname: string;
    boardSerial: string;
  }) {
    const iot_authinfo = new Iot_authinfo();
    iot_authinfo.boardIdx = boardIdx;
    iot_authinfo.userIdx = userIdx;
    iot_authinfo.boardTempname = boardTempname;
    iot_authinfo.boardSerial = boardSerial;
    return iot_authinfo;
  }

  updateFromDto(dto: UpdateIotAuthinfoDto) {
    this.boardIdx = dto.boardIdx;
    // this.currentLight = dto.currentLight;
    // this.autochkLight = dto.autochkLight;
    // this.autochkWaterpump = dto.autochkWaterpump;
    // this.autochkCoolingfan = dto.autochkCoolingfan;
    // this.currentTemp = dto.currentTemp;
    // this.current2Temp = dto.current2Temp;
    // this.maxTemp = dto.maxTemp;
    // this.minTemp = dto.minTemp;
    // this.currentHumid = dto.currentHumid;
    // this.current2Humid = dto.current2Humid;
    // this.maxHumid = dto.maxHumid;
    // this.minHumid = dto.minHumid;
    // this.usage = dto.usage;

    // console.log("updateBoard::3");
    // console.log(dto);
  }
}
