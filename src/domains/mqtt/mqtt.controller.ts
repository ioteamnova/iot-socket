import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { MqttService } from "./mqtt.service";
// import { CreateIotBoardPersonalDto } from '../iot_board_personal/dtos/create-iot-baord-personal.dto';
// import { CreateIotNaturerecordDto } from '../iot_nature_record/dtos/create-Iotnaturerecord.dto';
// import { CreateIotControlrecordDto } from '../iot_control_record/dtos/create-Iotcontrolrecord.dto';
import { MessagePattern, Payload as pd, ClientProxy, Ctx, MqttContext, MqttRecordBuilder, NatsContext, Client, Transport } from '@nestjs/microservices';
const fs = require('fs');
import { Constants } from "src/core/Constants/Constants";

//nodejs mqtt 로 만든 코드
var mqtt = require('mqtt');

// const clientKey = fs.readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_key.pem');
// const clientCert = fs.readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_crt.crt');
// const caCert = fs.readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/ca.crt');

const clientKey = fs.readFileSync('/etc/mosquitto/CA/client_key.pem');
const clientCert = fs.readFileSync('/etc/mosquitto/CA/client_crt.crt');
const caCert = fs.readFileSync('/etc/mosquitto/CA/ca.crt');

const options = {
  host: "43.201.185.236",
  port: 8883,
  protocol: 'mqtts',
  ca: [caCert],
  key: clientKey,
  cert: clientCert,
  rejectUnauthorized: false,
};
const client = mqtt.connect(options);

//전송할 데이터 세팅
let options_v = {
  retain: true,
  qos: 0
};

//publish topic 전체선언
let pubtopic = "";
//전에 실행했던 토픽을 저장하는 변수
let beforeTopicAction = "";

var options_test = {
  retain: true,
  qos: 0
};

//제품코드 등록 pub
// var senddata_test = {
//   userIdx: 30, //서칭 데이터
//   cageName: 'test', //or control
//   maxTemp: 30,
//   minTemp: 20,
//   maxHumid: 80,
//   minHumid: 40,
//   usage: "크레스티드 게코",
//   boardTempname: "KR_B1", //서칭 데이터
//   autoLightUtctimeOn: "12:00",
//   autoLightUtctimeOff: "13:00",
// };

//온습도 세팅 pub
// var senddata = {
//   userIdx:1, //서칭 데이터
//   maxTemp:85.8, 
//   minTemp:20.2,
//   maxHumid:88.1, 
//   minHumid:45.5, 
//   boardTempname:"p1", //서칭 데이터
// }; 

//온습도 통신 auto pub
// var senddata = {
//   userIdx:1, //서칭 데이터
//   currentTemp:29.9, 
//   currentHumid:41.2,
//   type:2, //1. auto, 2. passive 
//   boardSerial:"123efwe4894wfwef111", //서칭 데이터
// }; 

//제어모듈 통신 auto pub
// var senddata = {
//   userIdx:1, //서칭 데이터
//   light:false, 
//   //waterpump:false,
//   //coolingfan:true,
//   type:1, //1. auto, 2. passive 
//   boardSerial:"123efwe4894wfwef", //서칭 데이터
// }; 

//비상알람 통신 auto pub
var senddata_test = {
  userIdx: 30, //서칭 데이터
  boardSerial: "HJKSFBIUWEBUVEMKNJWE", //서칭 데이터
  module: 1,
  limit: "MAX_TEMP",
  currentTemp: 40.5,
  currentHumid: 50.3,
  currentTemp2: 35.8,
  currentHumid2: 55.1,
  type: 1,
};



// var senddata = "macbook 온도 제어 데이터 : 3";
function intervalFunc() {
  //-********-//
  //제품코드 등록 request
  // client.publish("setup/request/nest", JSON.stringify(senddata_test), options_test);
  //client.publish("HJKSFBIUWEBUVEMKNJWE/setup/request/pico", JSON.stringify(senddata_test), options_test);
  //client.publish("30/KR_B1/setup/response/app", JSON.stringify(senddata_test), options_test);
  // client.publish("hello", JSON.stringify(senddata_test), options_test);
  client.publish("emergency/getresponse/nest", JSON.stringify(senddata_test), options_test);

  console.log("***setup pub::1");

  //searchAuth.userIdx+"/"+searchAuth.boardTempname+"/setup/response/app"

  //제품코드 등록 response
  // client.publish("setup/response/pico", JSON.stringify(senddata), options_);
  // console.log("***setup pub::1");

  //온습도 세팅 setrequest
  //client.publish("temphumid/setrequest/nest", JSON.stringify(senddata), options_);
  //console.log("***temphumid_set pub::1");

  //온습도 세팅 setresponse


  //온습도 getresponse
  //client.publish("temphumid/getrequest/nest", JSON.stringify(senddata), options_);
  //console.log("***temphumid_get pub::1");

  //온습도 getrequest

  //제어모듈 getresponse
  //client.publish("controlm/getrequest/nest", JSON.stringify(senddata), options_);
  //console.log("***controlm_get pub::1");

  //제어모듈 getrequest
}

// intervalFunc();
//setInterval(intervalFunc, 2000);


//보유 메세지 삭제하는 코드 예시 
// let optionsDelete = {
//   retain: true,
//   qos: 0
// };
// // client.publish("setup/request/nest", null, optionsDelete);
// client.publish("emergency/getresponse/nest", null, optionsDelete);



@Controller()
export class MqttController {
  constructor(private readonly mqttService: MqttService) { }

  //1.제품코드 등록 요청 : useridx, boardTempname 조회 
  @MessagePattern('setup/request/nest')
  async setupBoardSerialRequest(@pd() data: String) {
    console.log("*****************************************::제품코드 등록 요청::*****************************************");
    console.log("제품코드 등록 요청::");
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("origindata : " + JSON.stringify(origindata));

    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
    //존재하지 않으면 false
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardTempname", origindata.boardTempname);
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {
      //중복 체크 : searchAuth에서 가져온 idx가 보드에 있는지 확인한다. 값이 없으면 저장한다. 
      const searchAuth_Board = await this.mqttService.chkDuplicate(searchAuth.idx, searchAuth.userIdx);
      console.log("searchAuth_Board : " + JSON.stringify(searchAuth_Board));

      //값이 없을때만 저장한다.
      if (!searchAuth_Board) {
        //json 데이터 생성
        const createiotData = {
          userIdx: searchAuth.userIdx,
          authIdx: searchAuth.idx,
          cageName: origindata.cageName,
          current_uvb_light: 0,
          current_heating_light: 0,
          autoChkLight: origindata.autoChkLight,
          autoChkTemp: origindata.autoChkTemp,
          autoChkHumid: origindata.autoChkHumid,
          currentTemp: 0,
          currentTemp2: 0,
          maxTemp: origindata.maxTemp,
          minTemp: origindata.minTemp,
          currentHumid: 0,
          currentHumid2: 0,
          maxHumid: origindata.maxHumid,
          minHumid: origindata.minHumid,
          usage: origindata.usage,
          autoLightUtctimeOn: origindata.autoLightUtctimeOn,
          autoLightUtctimeOff: origindata.autoLightUtctimeOff,
        }

        console.log("createiotData : " + JSON.stringify(createiotData));


        //**** 저장할때 한번만 저장되게 수정하기*** */
        const createBoard = await this.mqttService.createIotPersonal(JSON.parse(JSON.stringify(createiotData)));

        //json 데이터 생성
        const updateiotData = {
          boardIdx: createBoard.idx
        }
        //auth boardIdx 업데이트 하기
        const updateAuth = await this.mqttService.updateIotAuth(JSON.parse(JSON.stringify(updateiotData)), searchAuth.idx);
        console.log("createBoard : " + JSON.stringify(createBoard));
        console.log("updateAuth : " + JSON.stringify(updateAuth));

        //utc 시간 자르기
        let autoLightUtctimeOn = origindata.autoLightUtctimeOn;
        let autoLightUtctimeOff = origindata.autoLightUtctimeOff;
        autoLightUtctimeOn = autoLightUtctimeOn.split(':');
        autoLightUtctimeOff = autoLightUtctimeOff.split(':');

        //전송 데이터
        let senddata = {
          userIdx: origindata.userIdx,
          maxTemp: origindata.maxTemp,
          minTemp: origindata.minTemp,
          maxHumid: origindata.maxHumid,
          minHumid: origindata.minHumid,
          autoChkLight: origindata.autoChkLight,
          autoChkTemp: origindata.autoChkTemp,
          autoChkHumid: origindata.autoChkHumid,
          ligthTurnOnHour: autoLightUtctimeOn[0],
          ligthTurnOnMinute: autoLightUtctimeOn[1],
          ligthTurnOffHour: autoLightUtctimeOff[0],
          ligthTurnOffMinute: autoLightUtctimeOff[1],
          return: true,
        };
        pubtopic = searchAuth.boardSerial + "/setup/request/pico";
        //publish 생성
        this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

        //변경하면서 전에 토픽 보유 메세지 삭제하기 
        this.topicRetainDelete(beforeTopicAction, pubtopic);
        console.log("senddata : " + JSON.stringify(senddata));

        console.log("*****************************************::제품코드 등록 요청::*****************************************");
      } else {
        //이미 등록된 데이터가 있다고 app으로 publish
        let senddata = {
          type: "제품코드 등록 요청",
          message: Constants.REGIST_SERIALNUM,
          return: false,
        };
        pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/setup/response/app";
        this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

        console.log("제품코드 등록 요청::1");
        console.log(Constants.CANNOT_FIND_AUTH);
        console.log(pubtopic);

        //변경하면서 전에 토픽 보유 메세지 삭제하기 
        this.topicRetainDelete(beforeTopicAction, pubtopic);
      }
    } else { //null
      //등록된 사용자 인증 코드가 없다고 app으로 publish
      let senddata = {
        type: "제품코드 등록 요청",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/setup/response/app";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      console.log("제품코드 등록 요청::1");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);
    }
  }

  //1.제품코드 등록 응답 : useridx, boardSerial 조회 
  @MessagePattern('setup/response/nest')
  async setupBoardSerialResponse(@pd() data: String) {
    console.log("*****************************************::제품코드 등록 응답::*****************************************");
    console.log("제품코드 등록 응답::1");
    //userIdx, boardTempname 조회하여 체크
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
    console.log("origindata : " + JSON.stringify(origindata));

    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
    //존재하지 않으면 false
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    //데이터가 존재한다면 iot_personal에 저장할 것. 
    if (searchAuth) {
      //주기적으로 전송하기
      let senddata = {
        result: true
      };

      pubtopic = searchAuth.userIdx + "/" + searchAuth.boardTempname + "/setup/response/app";
      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::제품코드 등록 응답::*****************************************");

      // return true;
    } else {//null

      //등록된 사용자 인증 코드가 없다고 pico로 publish
      let senddata = {
        type: "제품코드 등록 응답::1",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.boardSerial + "/setup/request/pico";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("제품코드 등록 응답::1");
      console.log(Constants.CANNOT_FIND_AUTH);
    }
  }

  //2.온습도 세팅 요청, 다른 정보 수정 : userIdx, boardTempname 조회
  @MessagePattern('temphumid/setrequest/nest')
  async setNatureInfoRequest(@pd() data: String) {

    console.log("*****************************************::온도 세팅, 보드정보 변경 요청::*****************************************");
    console.log("온도 세팅, 보드정보 변경 요청::2");

    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
    console.log("origindata : " + JSON.stringify(origindata));

    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardTempname", origindata.boardTempname);
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {

      //보드 정보 가져오기
      const boardOneInfo = await this.mqttService.getBoardInfo(searchAuth.idx, searchAuth.userIdx);


      console.log("origindata :: " + JSON.stringify(origindata));
      // console.log("autoChkLight :: " + new Boolean(origindata.autoChkLight));
      console.log("autoChkHumid :: " + origindata.autoChkLight);
      // console.log("autoChkTemp :: " + new Boolean(origindata.autoChkTemp));
      console.log("autoChkTemp :: " + origindata.autoChkTem);
      // console.log("autoChkHumid :: " + new Boolean(origindata.autoChkHumid));
      console.log("autoChkHumid :: " + origindata.autoChkHumid);

      //json 데이터 생성
      const updateiotData = {
        cageName: origindata.cageName,
        autoChkLight: origindata.autoChkLight,
        autoChkTemp: origindata.autoChkTemp,
        autoChkHumid: origindata.autoChkHumid,
        maxTemp: origindata.maxTemp,
        minTemp: origindata.minTemp,
        maxHumid: origindata.maxHumid,
        minHumid: origindata.minHumid,
        usage: origindata.usage,
        autoLightUtctimeOn: origindata.autoLightUtctimeOn,
        autoLightUtctimeOff: origindata.autoLightUtctimeOff,
      }

      // if (origindata.autoChkLight == "undefined") {
      //   delete origindata.autoChkLight;
      // }
      // if (origindata.autoChkTemp == "undefined") {
      //   delete origindata.autoChkTemp;
      // }
      // if (origindata.autoChkHumid == "undefined") {
      //   delete origindata.autoChkHumid;
      // }

      console.log("updateiotData :: " + JSON.stringify(updateiotData));

      const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), boardOneInfo.idx);
      console.log("boardOneInfo : " + JSON.stringify(boardOneInfo));
      console.log("updateBoard : " + JSON.stringify(updateBoard));

      //전송 데이터
      let senddata = {
        maxTemp: origindata.maxTemp,
        minTemp: origindata.minTemp,
        maxHumid: origindata.maxHumid,
        minHumid: origindata.minHumid,
        autoChkLight: origindata.autoChkLight,
        autoChkTemp: origindata.autoChkTemp,
        autoChkHumid: origindata.autoChkHumid,
        ligthTurnOffHour: origindata.ligthTurnOffHour,
        ligthTurnOffMinute: origindata.ligthTurnOffMinute,
        ligthTurnOnHour: origindata.ligthTurnOnHour,
        ligthTurnOnMinute: origindata.ligthTurnOnMinute,
      };

      pubtopic = searchAuth.boardSerial + "/temphumid/setrequest/pico";
      console.log("senddata : " + JSON.stringify(senddata));

      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::온도 세팅, 보드정보 변경 요청::*****************************************");
    } else {//null
      //등록된 사용자 인증 코드가 없다고 app으로 publish
      let senddata = {
        type: "온도 세팅, 보드정보 변경 요청::2",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/temphumid/setresponse/app";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      console.log("온도 세팅, 보드정보 변경 요청::2");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);
    }
  }

  //2.온도 세팅, 보드정보 변경 응답 : useridx, boardSerial 조회 
  @MessagePattern('temphumid/setresponse/nest')
  async setNatureInfoResponse(@pd() data: String) {

    console.log("*****************************************::온도 세팅, 보드정보 변경 응답::*****************************************");
    //userIdx, boardSerial 조회하여 체크
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("온도 세팅, 보드정보 변경 응답::1");
    console.log("origindata : " + JSON.stringify(origindata));

    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
    //존재하지 않으면 false
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

    console.log("온도 세팅, 보드정보 변경 응답::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {
      //데이터가 존재한다면 iot_personal에 저장할 것. 
      console.log("온도 세팅, 보드정보 변경 응답::3");

      //주기적으로 전송하기
      let senddata = {
        result: true
      };

      pubtopic = searchAuth.userIdx + "/" + searchAuth.boardTempname + "/temphumid/setresponse/app";

      console.log("온도 세팅, 보드정보 변경 응답::5");
      console.log("searchAuth.userIdx : " + searchAuth.userIdx);
      console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));

      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::온도 세팅, 보드정보 변경 응답::*****************************************");

    } else {//null
      console.log("온도 세팅, 보드정보 변경 응답::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //3.온습도 응답 : userIdx, boardSerial 조회
  @MessagePattern('temphumid/getresponse/nest')
  async getNatureInfoResponse(@pd() data: String) {

    console.log("*****************************************::온습도 응답::*****************************************");
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("온습도 응답::1");
    console.log("origindata : " + JSON.stringify(origindata));

    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

    console.log("온습도 응답::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {
      console.log("온습도 응답::3");

      //보드 정보 가져오기
      const boardOneInfo = await this.mqttService.getBoardInfo(searchAuth.idx, searchAuth.userIdx);
      console.log("온습도 응답::4");
      console.log("searchAuth : " + JSON.stringify(boardOneInfo));

      //주기적으로 전송하기
      let senddata = {
        currentTemp: origindata.currentTemp,
        currentHumid: origindata.currentHumid,
        currentTemp2: origindata.currentTemp2,
        currentHumid2: origindata.currentHumid2,
        type: origindata.type,
      };

      //json 데이터 생성
      const updateiotData = {
        currentTemp: origindata.currentTemp,
        currentHumid: origindata.currentHumid,
        currentTemp2: origindata.currentTemp2,
        currentHumid2: origindata.currentHumid2,
      }
      //현재 온습도 업데이트
      const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), boardOneInfo.idx);
      console.log("updateBoard : " + JSON.stringify(updateBoard));

      //자동일때만 저장한다. 수동일때는 저장 안함. 
      if (origindata.type == 1) {
        //json 데이터 생성
        const creatNatureData = {
          boardIdx: boardOneInfo.idx,
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
          currentTemp2: origindata.currentTemp2,
          currentHumid2: origindata.currentHumid2,
          type: origindata.type,
        }

        //온습도 추가  ****************
        const createIotNature = await this.mqttService.createIotnaturerecord(JSON.parse(JSON.stringify(creatNatureData)));
        console.log("온습도 응답::5");
        console.log("createIotNature : " + JSON.stringify(createIotNature));
      }

      //수동일때만 전송
      if (origindata.type == 2) {
        pubtopic = searchAuth.userIdx + "/" + searchAuth.boardTempname + "/temphumid/getresponse/app";
        this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));
      }

      console.log("*****************************************::온습도 응답::*****************************************");
    } else {//null
      console.log("온습도 응답::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //4.온습도 요청 : useridx, boardTempname 조회 
  @MessagePattern('temphumid/getrequest/nest')
  async getNatureInfoRequest(@pd() data: String) {

    console.log("*****************************************::온습도 요청::*****************************************");
    console.log("온습도 요청::1");

    //userIdx, boardTempname 조회하여 체크
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("온습도 요청::1");
    console.log("origindata : " + JSON.stringify(origindata));

    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardTempname", origindata.boardTempname);

    console.log("온습도 요청::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {
      //데이터가 존재한다면 iot_personal에 저장할 것. 
      console.log("온습도 요청::3");

      //주기적으로 전송하기
      let senddata = {
        type: origindata.type
      };

      pubtopic = searchAuth.boardSerial + "/temphumid/getrequest/pico";
      console.log("온습도 요청::5");
      console.log("searchAuth.userIdx : " + searchAuth.userIdx);
      console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));


      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      console.log("*****************************************::온습도 요청::*****************************************");

    } else {//null
      //등록된 사용자 인증 코드가 없다고 app으로 publish
      let senddata = {
        type: "온습도 요청",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/temphumid/getresponse/app";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("온습도 요청::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }


  //5.제어모듈 자동 응답 : useridx, boardSerial 조회 
  @MessagePattern('controlm/getresponse/nest')
  async getControlmResponse(@pd() data: String) {

    console.log("*****************************************::제어모듈 응답::*****************************************");
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
    console.log("제어모듈 응답::1");
    console.log("origindata : " + JSON.stringify(origindata));

    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

    console.log("제어모듈 응답::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {

      //보드 정보 가져오기
      const boardOneInfo = await this.mqttService.getBoardInfo(searchAuth.idx, searchAuth.userIdx);

      console.log("제어모듈 응답::3");
      console.log("origindata : " + JSON.stringify(origindata));

      //light on off일때만 동작
      if (origindata.Commanded_Function == "UVB_ON" || origindata.Commanded_Function == "UVB_OFF" || origindata.Commanded_Function == "HEAT_ON" || origindata.Commanded_Function == "HEAT_OFF") {

        //업데이트할 데이터 생성
        const updateiotData = {
          currentUvbLight: 0,
          currentHeatingLight: 0,
        }

        //변경되는 데이터 수정
        if (origindata.Commanded_Function == "UVB_ON") {
          updateiotData.currentUvbLight = 1;
          delete updateiotData.currentHeatingLight;
        } else if (origindata.Commanded_Function == "UVB_OFF") {
          updateiotData.currentUvbLight = 0;
          delete updateiotData.currentHeatingLight;
        } else if (origindata.Commanded_Function == "HEAT_ON") {
          delete updateiotData.currentUvbLight;
          updateiotData.currentHeatingLight = 1;
        } else if (origindata.Commanded_Function == "HEAT_OFF") {
          delete updateiotData.currentUvbLight;
          updateiotData.currentHeatingLight = 0;
        }

        console.log("제어모듈 응답::4");
        console.log("updateiotData : " + updateiotData);

        //현재 제어모듈 상태 업데이트
        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), boardOneInfo.idx);
        console.log("updateBoard : " + updateBoard);
      }

      //creatControlData 를 수정 : 받아온 데이터중 널이 존재하면 currentControlinfo 여기서 데이터로 변경해줄 것
      console.log("제어모듈 응답::5");

      //최근 제어모듈 데이터 가져오기
      const currentControlinfo = await this.mqttService.getIotcontrolinfo(boardOneInfo.idx);
      console.log("currentControlinfo : " + currentControlinfo);

      //json 데이터 생성
      const creatControlData = {
        boardIdx: boardOneInfo.idx,
        uvbLight: 0,
        heatingLight: 0,
        waterPump: 0,
        coolingFan: 0,
        type: origindata.type,
      }

      //최근 데이터가 있는 경우
      if (currentControlinfo != null) {
        creatControlData.uvbLight = currentControlinfo.uvbLight;
        creatControlData.heatingLight = currentControlinfo.heatingLight;
        creatControlData.waterPump = 0;
        creatControlData.coolingFan = 0;
      } else { //최근 데이터가 없는 경우
        creatControlData.uvbLight = 0;
        creatControlData.heatingLight = 0;
        creatControlData.waterPump = 0;
        creatControlData.coolingFan = 0;
      }

      //변경되는 데이터 수정
      if (origindata.Commanded_Function == "UVB_ON") {
        console.log("UVB_ON");
        creatControlData.uvbLight = 1;
      } else if (origindata.Commanded_Function == "UVB_OFF") {
        console.log("UVB_OFF");
        creatControlData.uvbLight = 0;
      } else if (origindata.Commanded_Function == "COOLINGFAN_ON") {
        console.log("COOLINGFAN_ON");
        creatControlData.coolingFan = 1;
      } else if (origindata.Commanded_Function == "WATERPUMP_ON") {
        console.log("WATERPUMP_ON");
        creatControlData.waterPump = 1;
      } else if (origindata.Commanded_Function == "HEAT_ON") {
        creatControlData.heatingLight = 1;
      } else if (origindata.Commanded_Function == "HEAT_OFF") {
        creatControlData.heatingLight = 0;
      }

      console.log("제어모듈 응답::6");

      // 제어모듈 추가  ****************
      const createIotControl = await this.mqttService.createIotcontrolrecord(JSON.parse(JSON.stringify(creatControlData)));

      console.log("제어모듈 응답::7");
      console.log("createIotControl : " + JSON.stringify(createIotControl));

      //publish할 데이터 
      let senddata = {
        Commanded_Function: origindata.Commanded_Function,
        type: origindata.type,
      };

      pubtopic = searchAuth.userIdx + "/" + searchAuth.boardTempname + "/controlm/getresponse/app";
      console.log("제어모듈 응답::8");

      console.log("searchAuth.userIdx : " + searchAuth.userIdx);
      console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));

      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::제어모듈 응답::*****************************************");
    } else {//null
      console.log("제어모듈 응답::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //6.제어모듈 요청 : useridx, boardTempname 조회 
  @MessagePattern('controlm/getrequest/nest')
  async getControlmRequest(@pd() data: String) {

    console.log("*****************************************::제어모듈 요청::*****************************************");
    console.log("제어모듈 요청::1");

    //userIdx, boardTempname 조회하여 체크
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("제어모듈 요청::1");
    console.log("origindata : " + JSON.stringify(origindata));

    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardTempname", origindata.boardTempname);

    console.log("제어모듈 요청::2");
    console.log("searchAuth : " + searchAuth);
    console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);

    if (searchAuth) {
      //데이터가 존재한다면 iot_personal에 저장할 것. 
      console.log("제어모듈 요청::3");

      //주기적으로 전송하기
      let senddata = {
        Commanded_Function: origindata.Commanded_Function, //passive
        type: origindata.type //passive
      };

      pubtopic = searchAuth.boardSerial + "/controlm/getrequest/pico";

      console.log("제어모듈 요청::5");
      console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));

      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      console.log("*****************************************::제어모듈 요청::*****************************************");

    } else {//null
      //등록된 사용자 인증 코드가 없다고 app으로 publish
      let senddata = {
        type: "제어모듈 요청",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/controlm/getresponse/app";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("제어모듈 요청::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //7.보드정보 요청 : useridx, boardTempname 조회 
  @MessagePattern('boardinfo/getrequest/nest')
  async getBoardinfoRequest(@pd() data: String) {

    console.log("*****************************************::보드정보 요청::*****************************************");

    console.log("보드정보 요청::1");

    //userIdx, boardTempname 조회하여 체크
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("보드정보 요청::1");
    console.log("origindata : " + JSON.stringify(origindata));


    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
    //존재하지 않으면 false
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardTempname", origindata.boardTempname);

    console.log("보드정보 요청::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {
      //전송할 데이터 만들기 
      let senddata = {
        result: true
      };

      pubtopic = searchAuth.boardSerial + "/boardinfo/getrequest/pico";

      console.log("보드정보 요청::3");
      console.log("searchAuth : " + JSON.stringify(searchAuth));

      console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));


      //publish 생성
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::보드정보 요청::*****************************************");

    } else {//null
      //등록된 사용자 인증 코드가 없다고 app으로 publish
      let senddata = {
        type: "보드정보 요청",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/boardinfo/getresponse/app";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("보드정보 요청::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //7.보드정보 응답 : useridx, boardSerial 조회 
  @MessagePattern('boardinfo/getresponse/nest')
  async getBoardinfoResponse(@pd() data: String) {

    console.log("*****************************************::보드정보 응답::*****************************************");
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
    console.log("보드정보 응답::1");
    console.log("origindata : " + JSON.stringify(origindata));

    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

    console.log("보드정보 응답::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {

      console.log("보드정보 응답::3");
      console.log("origindata : " + JSON.stringify(origindata));

      //보드 정보 가져오기
      const boardOneInfo = await this.mqttService.getBoardInfo(searchAuth.idx, searchAuth.userIdx);

      //전송데이터 불러오기
      const boardInfo = await this.mqttService.getBoardList(boardOneInfo.idx, searchAuth.userIdx);
      console.log("보드정보 응답::3");
      console.log("boardInfo : " + JSON.stringify(boardInfo));

      //publish할 데이터 
      let senddata = {
        boardIdx: boardInfo.idx,
        cageName: boardInfo.cageName,
        currentUvbLight: boardInfo.currentUvbLight,
        currentHeatingLight: boardInfo.currentHeatingLight,
        autoChkLight: boardInfo.autoChkLight,
        autoChkTemp: boardInfo.autoChkTemp,
        autoChkHumid: boardInfo.autoChkHumid,
        currentTemp: origindata.currentTemp, //최신 온습도 세팅
        currentTemp2: origindata.currentTemp2, //최신 온습도 세팅
        maxTemp: boardInfo.maxTemp,
        minTemp: boardInfo.minTemp,
        currentHumid: origindata.currentHumid, //최신 온습도 세팅
        currentHumid2: origindata.currentHumid2, //최신 온습도 세팅
        maxHumid: boardInfo.maxHumid,
        minHumid: boardInfo.minHumid,
        usage: boardInfo.usage,
        autoLightUtctimeOn: boardInfo.autoLightUtctimeOn,
        autoLightUtctimeOff: boardInfo.autoLightUtctimeOff,
      };

      pubtopic = searchAuth.userIdx + "/" + searchAuth.boardTempname + "/boardinfo/getresponse/app";
      console.log("보드정보 응답::4");

      console.log("searchAuth.userIdx : " + searchAuth.userIdx);
      console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));

      //publish 생성
      //client.publish(pubtopic, JSON.stringify(senddata), options_v);
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::보드정보 응답::*****************************************");
    } else {//null
      console.log("보드정보 응답::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //8.비상알람 자동 응답 : useridx, boardSerial 조회 
  @MessagePattern('emergency/getresponse/nest')
  async getEmergencyResponse(@pd() data: String) {

    console.log("*****************************************::비상알람 응답::*****************************************");
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
    console.log("비상알람 응답::1");
    console.log("origindata : " + JSON.stringify(origindata));

    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

    console.log("비상알람 응답::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {

      //보드 정보 가져오기
      const boardOneInfo = await this.mqttService.getBoardInfo(searchAuth.idx, searchAuth.userIdx);

      console.log("비상알람 응답::3");
      console.log("origindata : " + JSON.stringify(origindata));

      const creatEmergencyData = {
        boardIdx: boardOneInfo.idx,
        module: origindata.module,
        limit: origindata.limit,
        currentTemp: origindata.currentTemp,
        currentHumid: origindata.currentHumid,
        currentTemp2: origindata.currentTemp2,
        currentHumid2: origindata.currentHumid2,
        type: origindata.type,
      }
      // 비상알람 추가  ****************
      const createIotEmergency = await this.mqttService.createIotEmergency(JSON.parse(JSON.stringify(creatEmergencyData)));

      console.log("비상알람 응답::4");
      console.log("createIotEmergency : " + JSON.stringify(createIotEmergency));

      //publish할 데이터 
      let senddata = {
        module: origindata.module,
        limit: origindata.limit,
        currentTemp: origindata.currentTemp,
        currentHumid: origindata.currentHumid,
        currentTemp2: origindata.currentTemp2,
        currentHumid2: origindata.currentHumid2,
        type: origindata.type,
      };

      pubtopic = searchAuth.userIdx + "/" + searchAuth.boardTempname + "/emergency/getresponse/app";
      console.log("비상알람 응답::5");

      console.log("searchAuth.userIdx : " + searchAuth.userIdx);
      console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
      console.log("pubtopic : " + pubtopic);
      console.log("senddata : " + JSON.stringify(senddata));

      //publish 생성
      //client.publish(pubtopic, JSON.stringify(senddata), options_v);
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("*****************************************::비상알람 응답::*****************************************");
    } else {//null
      console.log("비상알람 응답::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }

  //9.제품코드 재등록 요청 : useridx, boardTempname 조회 
  @MessagePattern('resetup/request/nest')
  async resetupBoardRequest(@pd() data: String) {

    console.log("*****************************************::제품코드 재등록 요청::*****************************************");

    console.log("제품코드 재등록 요청::1");

    //userIdx, boardTempname 조회하여 체크
    let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

    console.log("제품코드 재등록 요청::1");
    console.log("origindata : " + JSON.stringify(origindata));


    //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true, 존재하지 않으면 false
    const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardTempname", origindata.boardTempname);

    console.log("제품코드 재등록 요청::2");
    console.log("searchAuth : " + JSON.stringify(searchAuth));

    if (searchAuth) {
      //보드 정보 가져오기
      const boardInfo = await this.mqttService.getBoardInfo(searchAuth.idx, searchAuth.userIdx);

      console.log("제품코드 재등록 요청::3");
      console.log("searchAuth : " + JSON.stringify(searchAuth));
      console.log("searchAuth : " + JSON.stringify(boardInfo));

      //보내온 보드 idx가 searchAuth의 idx로 찾은 boardidx와 비교해서 같으면 통과 다르면 맞지 않다고 리턴
      if (boardInfo.idx == origindata.boardIdx) {
        //전송할 데이터 만들기 
        let senddata = {
          result: true
        };
        pubtopic = searchAuth.boardSerial + "/setup/request/pico";

        console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
        console.log("pubtopic : " + pubtopic);
        console.log("senddata : " + JSON.stringify(senddata));

        //publish 생성
        //client.publish(pubtopic, JSON.stringify(senddata), options_v);
        this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

        //변경하면서 전에 토픽 보유 메세지 삭제하기 
        this.topicRetainDelete(beforeTopicAction, pubtopic);

        console.log("*****************************************::제품코드 재등록 요청::*****************************************");
      } else {
        //등록된 사용자 인증 코드가 없다고 app으로 publish
        let senddata = {
          type: "제품코드 재등록 요청",
          message: Constants.CANNOT_FIND_AUTH,
          return: false,
        };
        pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/setup/request/app";
        //client.publish(pubtopic, JSON.stringify(senddata), options_v);
        this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

        //변경하면서 전에 토픽 보유 메세지 삭제하기 
        this.topicRetainDelete(beforeTopicAction, pubtopic);

        console.log("제품코드 재등록 요청::null");
        console.log(Constants.CANNOT_RESETUP);
        console.log(pubtopic);
      }
    } else {//null
      //등록된 사용자 인증 코드가 없다고 app으로 publish
      let senddata = {
        type: "제품코드 재등록 요청",
        message: Constants.CANNOT_FIND_AUTH,
        return: false,
      };
      pubtopic = origindata.userIdx + "/" + origindata.boardTempname + "/setup/request/app";
      //client.publish(pubtopic, JSON.stringify(senddata), options_v);
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);

      console.log("제품코드 재등록 요청::null");
      console.log(Constants.CANNOT_FIND_AUTH);
      console.log(pubtopic);
    }
  }



  //브로커에 보유 메시지 삭제 하는 코드
  async topicRetainDelete(beforePubtopic: string, currentTopic: string) {
    let optionsDelete = {
      retain: true,
      qos: 0
    };
    console.log("pubtopicDelete : " + beforePubtopic);
    console.log("currentTopic : " + currentTopic);

    client.publish(currentTopic, null, optionsDelete);
    console.log("현재 보유 메세지 삭제 완료");

    if (beforePubtopic != "") { //빈값이 아닐때 실행
      client.publish(beforePubtopic, null, optionsDelete);
      console.log("전 보유 메세지 삭제 완료");
    }
    beforeTopicAction = currentTopic; //실행시 현재 토픽 저장
  }

  //publish 기능 함수
  publishFunction(pubtopic: string, senddata: JSON) {
    client.publish(pubtopic, JSON.stringify(senddata), options_v);
  }





  @MessagePattern('hello')  //구독하는 주제1
  hello(@pd() data: String, @Ctx() context: MqttContext) {
    console.log("hello::data");
    console.log(data);

    if (data != "") {
      let senddata = {
        type: "hello",
        message: "hello",
        return: true,
      };
      pubtopic = "hello2";
      this.publishFunction(pubtopic, JSON.parse(JSON.stringify(senddata)));

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, "hello");
    }
  }


  @MessagePattern('hello2')  //구독하는 주제1
  hello2(@pd() data: String, @Ctx() context: MqttContext) {
    if (data != "") {
      console.log("hello2::data");
      console.log(data);

      //변경하면서 전에 토픽 보유 메세지 삭제하기 
      this.topicRetainDelete(beforeTopicAction, pubtopic);
    }
  }
}