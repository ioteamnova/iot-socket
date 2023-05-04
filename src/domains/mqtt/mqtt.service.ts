import {   
    ConflictException,
    Injectable,
    NotFoundException, } from '@nestjs/common';
//import { UserRepository } from '../user/repositories/user.repository';
//import { User } from '../user/entities/user.entity';

import { Iot_personalRepository } from '../iot_personal/repositories/iot_personal.repository';
import { Iot_personal } from '../iot_personal/entities/iot_personal.entity';
import { CreateIotPersonalDto } from '../iot_personal/dtos/create-Iotpersonal.dto';
import { UpdateIotPersonalDto } from '../iot_personal/dtos/update-Iotpersonal.dto';

import { Iot_authinfoRepository } from '../iot_authinfo/repositories/iot_authinfo.repository';
import { Iot_authinfo } from '../iot_authinfo/entities/iot_authinfo.entity';
import { UpdateIotAuthinfoDto } from '../iot_authinfo/dtos/update-Iotauthinfo.dto';



import { Iot_naturerecordRepository } from '../iot_naturerecord/repositories/iot_naturerecord.repository';
import { Iot_naturerecord } from '../iot_naturerecord/entities/iot_naturerecord.entity';
import { CreateIotNaturerecordDto } from '../iot_naturerecord/dtos/create-Iotnaturerecord.dto';

import { Iot_controlrecordRepository } from '../iot_controlrecord/repositories/iot_controlrecord.repository';
import { Iot_controlrecord } from '../iot_controlrecord/entities/iot_controlrecord.entity';
import { CreateIotControlrecordDto } from '../iot_controlrecord/dtos/create-Iotcontrolrecord.dto';


//import { HttpErrorConstants } from 'src/core/http/http-error-objects';
//import { SocketErrorConstants } from 'src/core/socket/socket-error-objects';
import { SocketErrorConstants } from 'src/core/socket/socket-error-objects';

import * as mqtt from 'mqtt';


@Injectable()
export class MqttService {
  private readonly client: mqtt.Client;
    constructor(
        //private userRepository: UserRepository,
        private iot_personalRepository: Iot_personalRepository,
        private iot_authinfoRepository: Iot_authinfoRepository,
        private iot_naturerecordRepository: Iot_naturerecordRepository,
        private iot_controlrecordRepository: Iot_controlrecordRepository,
        
      ) {}
        // const options = {
        //   host: process.env.SERVERHOST,
        // };
        // this.client = mqtt.connect(options);
        // this.client.on('connect', () => {
        //   console.log('MQTT client connected');
        // });
  /**
   * 내 정보 조회
   * @param userIdx 유저 인덱스
   * @returns 조회한 유저 정보
   */
      //  async addIotPersonal() {
      //   const userInfo = await this.Iot_personalRepository.findOne({
      //     where: { idx: userIdx },
      //   });
    
      //   if (!userInfo) {
      //     throw new NotFoundException(SocketErrorConstants.CANNOT_FIND_USER);
      //   }
      //   console.log('userInfo:::',userInfo);
      //   return {
      //     idx: userInfo.idx,
      //     email: userInfo.email,
      //     nickname: userInfo.nickname,
      //     profilePath: userInfo.profilePath,
      //     isPremium: userInfo.isPremium,
      //     agreeWithMarketing: userInfo.agreeWithMarketing,
      //     createdAt: userInfo.createdAt,
      //   };
      // }

  /**
   *  개인용 보드 등록
   * @param dto iot보드 dto
   * @returns board save
   */
  async createIotPersonal(dto: CreateIotPersonalDto): Promise<Iot_personal> {
    //await this.checkExistEmail(dto.email);
    console.log("createIot::2");

    const Iotpersonal = Iot_personal.fromDto(dto);
    console.log("createIot::3");

    return await this.iot_personalRepository.save(Iotpersonal);
  }

  /**
   *  보드 수정
   * @param dto iot보드 dto
   * @returns board update
   */
      async upadateIotPersonal(dto: UpdateIotPersonalDto, boardIdx: number) {
      console.log("updateBoard::1");
      const iot_personal = await this.iot_personalRepository.findOne({
        where: {
          idx: boardIdx,
          //userIdx: userIdx,
        },
      });
  
      if (!iot_personal) {
        throw new NotFoundException(SocketErrorConstants.CANNOT_FIND_BOARD);
      }
      //console.log(user);
  
      const result = iot_personal.updateFromDto(dto);
      console.log("updateBoard::2");
      
      return await this.iot_personalRepository.save(iot_personal);
    }
    
  /**
   *  사용자 인증
   * @param dto iot인증 dto
   * @returns auth search
   */
   async chkAuthinfo(userIdx: number, wheretype: string, code: string) {
   // async chkAuthinfo(userIdx: number, tempname: string, dto: UpdateIotPersonalDto): Promise<Iot_authinfo> {
        console.log("chkAuth::1");

        console.log(userIdx); 
        console.log(code);

        if(userIdx == null || code == null){
          throw new NotFoundException(SocketErrorConstants.CANNOT_RIGHT_PARM);
        }

        let iot_authinfo;
        if(wheretype == "tempname"){
          iot_authinfo = await this.iot_authinfoRepository.findOne({
            where: {
              userIdx: userIdx,
              boardTempname: code,
            },
          });
        }else if(wheretype == "boardSerial"){
          iot_authinfo = await this.iot_authinfoRepository.findOne({
            where: {
              userIdx: userIdx,
              boardSerial: code,
            },
          });
        }

        console.log("chkAuth::2");
        if (!iot_authinfo) {
          //throw new NotFoundException(SocketErrorConstants.CANNOT_FIND_AUTH);
          return null;
        }else{
          return iot_authinfo;
        }


      }


  /**
   *  보드 중복 체크 : boardIdx가 iot_personal 테이블에 있는지 체크
   * @param dto iot인증 dto
   * @returns 인증된 board search
   */
   async chkDuplicate(boardIdx: number, userIdx: number) {
    // async chkAuthinfo(userIdx: number, tempname: string, dto: UpdateIotPersonalDto): Promise<Iot_authinfo> {
         console.log("chkDuplicate::1");
 
         console.log(boardIdx); 
 
         if(boardIdx == null || boardIdx == 0 || userIdx == null){
           throw new NotFoundException(SocketErrorConstants.CANNOT_RIGHT_PARM);
         }
 
         let iot_auth_board = await this.iot_personalRepository.findOne({
          where: {
            idx: boardIdx,
            userIdx: userIdx,
          },
        });
 
        console.log("chkDuplicate***::2");
         if (!iot_auth_board) {
          return iot_auth_board;
         }else{
          return iot_auth_board;
         }
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


        const iot_auth = await this.iot_authinfoRepository.findOne({
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
        
        return await this.iot_authinfoRepository.save(iot_auth);
      }

      
  /**
   *  온습도 저장
   * @param dto iot보드 dto
   * @returns nature create
   */
   async createIotnaturerecord(dto: CreateIotNaturerecordDto): Promise<Iot_naturerecord> {
    console.log("createIotNature::1");
    console.log(dto);

    const Iotnaturerecord = Iot_naturerecord.fromDto(dto);
    console.log("createIotNature::2");
    console.log(Iotnaturerecord);

    return await this.iot_naturerecordRepository.save(Iotnaturerecord);
   }

  /**
   *  제어모듈 저장
   * @param dto iot보드 dto
   * @returns control create
   */
   async createIotcontrolrecord(dto: CreateIotControlrecordDto): Promise<Iot_controlrecord> {
    console.log("createIotControl::1");
    console.log(dto);

    const Iotcontrolrecord = Iot_controlrecord.fromDto(dto);
    console.log("createIotControl::2");
    console.log(Iotcontrolrecord);

    return await this.iot_controlrecordRepository.save(Iotcontrolrecord);
   }

     /**
   *  최근 제어모듈 데이터 찾기
   * @param dto iot보드 dto
   * @returns control search
   */
      async getIotcontrolinfo(boardIdx: number){
        console.log("getIotcontrolinfo::1");
    
        const controlInfo = await this.iot_controlrecordRepository
        .findOne({
          where: { boardIdx: boardIdx },
          order:{ createdAt : 'DESC' }
        });

        console.log("getIotcontrolinfo::2");
        console.log(controlInfo);
        

        if (!controlInfo) {
          return controlInfo;
          //throw new NotFoundException(SocketErrorConstants.CANNOT_FIND_USER);
        }else{
          console.log('controlInfo:::',controlInfo);
          return {
            idx: controlInfo.idx,
            light: controlInfo.light,
            waterpump: controlInfo.waterpump,
            coolingfan: controlInfo.coolingfan,
            type: controlInfo.type,
          };
        }
      }



      testtest(data) {
        console.log("Hello data : ");
        console.log(data);
      }
}