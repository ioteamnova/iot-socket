import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
//import { UserRepository } from '../user/repositories/user.repository';
//import { User } from '../user/entities/user.entity';

import { IotBoardPersonalRepository } from '../iot_board_personal/repositories/iot-board-personal.repository';
import { IotBoardPersonal } from '../iot_board_personal/entities/iot-board-personal.entity';
import { CreateIotBoardPersonalDto } from '../iot_board_personal/dtos/create-iot-baord-personal.dto';
import { UpdateIotBoardPersonalDto } from '../iot_board_personal/dtos/update-iot-board-personal.dto';

import { IotAuthInfoRepository } from '../iot_auth_info/repositories/iot-auth-info.repository';
import { IotAuthInfo } from '../iot_auth_info/entities/iot-auth-info.entity';
import { UpdateIotAuthinfoDto } from '../iot_auth_info/dtos/update-Iotauthinfo.dto';



import { IotNatureRecordRepository } from '../iot_nature_record/repositories/iot-nature-record.repository';
import { IotNatureRecord } from '../iot_nature_record/entities/iot-nature-record.entity';
import { CreateIotNaturerecordDto } from '../iot_nature_record/dtos/create-Iotnaturerecord.dto';

import { IotControlRecordRepository } from '../iot_control_record/repositories/iot-control-record.repository';
import { IotControlRecord } from '../iot_control_record/entities/iot-control-record.entity';
import { CreateIotControlrecordDto } from '../iot_control_record/dtos/create-Iotcontrolrecord.dto';


//import { HttpErrorConstants } from 'src/core/http/http-error-objects';
//import { SocketErrorConstants } from 'src/core/socket/socket-error-objects';
import { SocketErrorConstants } from 'src/core/socket/socket-error-objects';

import * as mqtt from 'mqtt';
import { CreateIotEmergencyDto } from '../iot_emergency/dtos/create-Iotemergency.dto';
import { IotEmergency } from '../iot_emergency/entities/iot-emergency.entity';
import { IotEmergencyRepository } from '../iot_emergency/repositories/iot-emergency.repository';


@Injectable()
export class MqttService {
  private readonly client: mqtt.Client;
  constructor(
    //private userRepository: UserRepository,
    private iotBoardPersonalRepository: IotBoardPersonalRepository,
    private iotAuthInfoRepository: IotAuthInfoRepository,
    private iotNatureRecordRepository: IotNatureRecordRepository,
    private iotControlRecordRepository: IotControlRecordRepository,
    private iotEmergencyRepository: IotEmergencyRepository,
  ) { }

  /**
   *  개인용 보드 등록
   * @param dto iot보드 dto
   * @returns board save
   */
  async createIotPersonal(dto: CreateIotBoardPersonalDto): Promise<IotBoardPersonal> {
    console.log("createIot::2");

    const Iotpersonal = IotBoardPersonal.fromDto(dto);
    console.log("createIot::3");

    return await this.iotBoardPersonalRepository.save(Iotpersonal);
  }

  /**
   *  보드 수정
   * @param dto iot보드 dto
   * @returns board update
   */
  async upadateIotPersonal(dto: UpdateIotBoardPersonalDto, boardIdx: number) {
    console.log("updateBoard::1");
    const iot_board_personal = await this.iotBoardPersonalRepository.findOne({
      where: {
        idx: boardIdx,
      },
    });

    if (!iot_board_personal) {
      throw new NotFoundException(SocketErrorConstants.CANNOT_FIND_BOARD);
    }

    const result = iot_board_personal.updateFromDto(dto);
    console.log("updateBoard::2");

    return await this.iotBoardPersonalRepository.save(iot_board_personal);
  }

  /**
   *  사용자 인증
   * @param dto iot인증 dto
   * @returns auth search
   */
  async chkAuthinfo(userIdx: number, wheretype: string, code: string) {
    console.log("chkAuth::1");

    console.log(userIdx);
    console.log(code);

    if (userIdx == null || code == null) {
      throw new NotFoundException(SocketErrorConstants.CANNOT_RIGHT_PARM);
    }

    let iot_authinfo;
    if (wheretype == "boardTempname") {
      iot_authinfo = await this.iotAuthInfoRepository.findOne({
        where: {
          userIdx: userIdx,
          boardTempname: code,
        },
      });
    } else if (wheretype == "boardSerial") {
      iot_authinfo = await this.iotAuthInfoRepository.findOne({
        where: {
          userIdx: userIdx,
          boardSerial: code,
        },
      });
    }

    console.log("chkAuth::2");
    if (!iot_authinfo) {
      return null;
    } else {
      return iot_authinfo;
    }
  }


  /**
   *  보드 중복 체크 : boardIdx가 iot_personal 테이블에 있는지 체크
   * @param dto iot인증 dto
   * @returns 인증된 board search
   */
  async chkDuplicate(authIdx: number, userIdx: number) {
    console.log("chkDuplicate::1");
    console.log(authIdx);
    console.log(userIdx);

    if (authIdx == null || userIdx == null) {
      throw new NotFoundException(SocketErrorConstants.CANNOT_RIGHT_PARM);
    }

    let iotboard = await this.iotBoardPersonalRepository.findOne({
      where: {
        authIdx: authIdx,
        userIdx: userIdx,
      },
    });

    console.log("chkDuplicate***::2");
    return iotboard;
  }

  /**
   *  사용자 인증 업데이트
   * @param dto iot보드 dto
   * @returns auth update
   */
  async updateIotAuth(dto: UpdateIotAuthinfoDto, authinfoIdx: number) {

    console.log("updateAuth::1");
    console.log(dto);
    console.log(authinfoIdx);


    const iot_auth = await this.iotAuthInfoRepository.findOne({
      where: {
        idx: authinfoIdx,
      },
    });

    if (!iot_auth) {
      throw new NotFoundException(SocketErrorConstants.CANNOT_FIND_AUTH);
    }
    //console.log(user);

    const result = iot_auth.updateFromDto(dto);
    console.log("updateBoard::2");

    return await this.iotAuthInfoRepository.save(iot_auth);
  }


  /**
   *  온습도 저장
   * @param dto iot보드 dto
   * @returns nature create
   */
  async createIotnaturerecord(dto: CreateIotNaturerecordDto): Promise<IotNatureRecord> {
    console.log("createIotNature::1");
    console.log(dto);

    const Iotnaturerecord = IotNatureRecord.fromDto(dto);
    console.log("createIotNature::2");
    console.log(Iotnaturerecord);

    return await this.iotNatureRecordRepository.save(Iotnaturerecord);
  }

  /**
   *  제어모듈 저장
   * @param dto iot보드 dto
   * @returns control create
   */
  async createIotcontrolrecord(dto: CreateIotControlrecordDto): Promise<IotControlRecord> {
    console.log("createIotControl::1");
    console.log(dto);

    const Iotcontrolrecord = IotControlRecord.fromDto(dto);
    console.log("createIotControl::2");
    console.log(Iotcontrolrecord);

    return await this.iotControlRecordRepository.save(Iotcontrolrecord);
  }

  /**
*  최근 제어모듈 데이터 찾기
* @param dto iot보드 dto
* @returns control search
*/
  async getIotcontrolinfo(boardIdx: number) {
    console.log("getIotcontrolinfo::1");

    const controlInfo = await this.iotControlRecordRepository
      .findOne({
        where: { boardIdx: boardIdx },
        order: { createdAt: 'DESC' }
      });

    console.log("getIotcontrolinfo::2");
    console.log(controlInfo);


    if (!controlInfo) {
      return controlInfo;
    } else {
      console.log('controlInfo:::', controlInfo);
      return {
        idx: controlInfo.idx,
        uvbLight: controlInfo.uvbLight,
        heatingLight: controlInfo.heatingLight,
        waterpump: controlInfo.waterPump,
        coolingfan: controlInfo.coolingFan,
        type: controlInfo.type,
      };
    }
  }

  /**
   *  보드 정보
   * @param dto 보드 dto
   * @returns Iot_board_personal
   */
  async getBoardList(
    boardIdx: number,
    userIdx: number
  ) {
    console.log(boardIdx);

    if (boardIdx == null || boardIdx == 0 || userIdx == null) {
      throw new NotFoundException(SocketErrorConstants.CANNOT_RIGHT_PARM);
    }

    let iot_board = await this.iotBoardPersonalRepository.findOne({
      where: {
        idx: boardIdx,
        userIdx: userIdx,
      },
    });

    return iot_board;
  }

  /**
 *  비상알람 등록
 * @param dto iot보드 dto
 * @returns board save
 */
  async createIotEmergency(dto: CreateIotEmergencyDto): Promise<IotEmergency> {
    console.log("createIotEmergency::1");

    const Iotemergency = IotEmergency.fromDto(dto);
    console.log("createIotEmergency::2");

    return await this.iotEmergencyRepository.save(Iotemergency);
  }

  /**
 *  authIdx로 보드정보 가져오기 
 * @param dto 
 * @returns 인증된 board search
 */
  async getBoardInfo(authIdx: number, userIdx: number) {
    console.log("chkResetupDuplicate::1");
    console.log(authIdx);

    if (authIdx == null) {
      throw new NotFoundException(SocketErrorConstants.CANNOT_RIGHT_PARM);
    }

    let iotboard = await this.iotBoardPersonalRepository.findOne({
      where: {
        authIdx: authIdx,
        userIdx: userIdx,
      },
    });

    console.log("chkResetupDuplicate***::2");
    console.log(iotboard);

    return iotboard;
  }


  testtest(data) {
    console.log("Hello data : ");
    console.log(data);
  }
}