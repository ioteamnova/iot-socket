//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
// import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { CreateIotPersonalDto } from '../dtos/create-Iotauthinfo.dto';
// import { UpdateIotPersonalDto } from '../dtos/update-Iotauthinfo.dto';
import { UpdateIotAuthinfoDto } from '../dtos/update-Iotauthinfo.dto';

//db 테이블 필드 맞추는 곳

@Entity()
export class IotAuthInfo extends BaseEntity {
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
    const iot_auth_info = new IotAuthInfo();
    iot_auth_info.userIdx = userIdx;
    iot_auth_info.boardTempname = boardTempname;
    iot_auth_info.boardSerial = boardSerial;
    return iot_auth_info;
  }

  updateFromDto(dto: UpdateIotAuthinfoDto) {
    // this.boardIdx = dto.boardIdx;
  }
}
