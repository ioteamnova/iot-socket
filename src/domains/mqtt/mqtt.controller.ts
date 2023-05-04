import { Body, Controller, Get, Param, Post, Query, Res  } from '@nestjs/common';
import { MqttService } from "./mqtt.service";
import { CreateIotPersonalDto } from '../iot_personal/dtos/create-Iotpersonal.dto';
import { CreateIotNaturerecordDto } from '../iot_naturerecord/dtos/create-Iotnaturerecord.dto';
import { CreateIotControlrecordDto } from '../iot_controlrecord/dtos/create-Iotcontrolrecord.dto';
import { MessagePattern, Payload as pd, ClientProxy, Ctx, MqttContext, MqttRecordBuilder, NatsContext, Client, Transport} from '@nestjs/microservices';
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
  // ca: [fs.readFileSync('/etc/mosquitto/CA/ca.crt')],
	// key: fs.readFileSync('/etc/mosquitto/CA/client_key.pem'),
	// cert: fs.readFileSync('/etc/mosquitto/CA/client_crt.crt'),
  ca: [caCert],
	key: clientKey,
	cert: clientCert,
  rejectUnauthorized: false,
};
const client = mqtt.connect(options);

//전송할 데이터 세팅
let options_v={
  retain:true,
qos:2};

let pubtopic = "";

// const client = mqtt.connect(options, {
//   ca: caFile,
//   cert: certFile,
//   key: keyFile
// });

  //제품코드 등록 pub
  // var senddata = {
  //   userIdx:1, //서칭 데이터
  //   petIdx:2,
  //   cageName:'뿡뿡', //or control
  //   maxTemp:30, 
  //   minTemp:20,
  //   maxHumid:80, 
  //   minHumid:40, 
  //   usage:"크레스티드 게코", 
  //   tempname:"p1", //서칭 데이터
  // };

  //온습도 세팅 pub
  // var senddata = {
  //   userIdx:1, //서칭 데이터
  //   maxTemp:85.8, 
  //   minTemp:20.2,
  //   maxHumid:88.1, 
  //   minHumid:45.5, 
  //   tempname:"p1", //서칭 데이터
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

  // var options_={
  //   retain:true,
  //   qos:2};


 // var senddata = "macbook 온도 제어 데이터 : 3";
  function intervalFunc() {
   //-********-//
    //제품코드 등록 request
    //client.publish("setup/request/nest", JSON.stringify(senddata), options_);
    //console.log("***setup pub::1");

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

  //intervalFunc();
  //setInterval(intervalFunc, 2000);

@Controller()
export class MqttController {
    constructor(private readonly mqttService: MqttService) {}

    //제품코드 등록 요청 : useridx, tempname 조회 
    @MessagePattern('setup/request/nest')  
    async setuprequest(@pd() data: String) {

      console.log("*****************************************::제품코드 등록 요청::*****************************************");
      console.log("제품코드 등록 요청::1");

      //userIdx, tempname 조회하여 체크
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
      //존재하지 않으면 false
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);

      console.log("제품코드 등록 요청::2");
      console.log("searchAuth : " + searchAuth);
      console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);

      if (searchAuth) {
        
        //중복 체크 : 해당 boardid가 iot_personal에 데이터가 있는지 확인 할 것.
        const searchAuth_Board = await this.mqttService.chkDuplicate(searchAuth.boardIdx, searchAuth.userIdx);

        //값이 없을때만 저장한다. 
        if(!searchAuth_Board){
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("제품코드 등록 요청::3");

          //json 데이터 생성
          const createiotData = {
            userIdx:origindata.userIdx, 
            petIdx:origindata.petIdx,
            cageName:origindata.cageName, 
            light:false, 
            waterpump:false, 
            coolingfan:false, 
            currentTemp:0, 
            maxTemp:origindata.maxTemp, 
            minTemp:origindata.minTemp,
            currentHumid:0, 
            maxHumid:origindata.maxHumid, 
            minHumid:origindata.minHumid, 
            usage:origindata.usage,
          }

          //**** 저장할때 한번만 저장되게 수정하기*** */
          const createBoard = await this.mqttService.createIotPersonal(JSON.parse(JSON.stringify(createiotData)));

          //json 데이터 생성
          const updateiotData = {
            boardIdx : createBoard.idx
          }

          //auth boardIdx 업데이트 하기
          const updateAuth = await this.mqttService.updateIotAuth(JSON.parse(JSON.stringify(updateiotData)), searchAuth.idx);


          console.log("제품코드 등록 요청::4");
          console.log("createBoard : " + JSON.stringify(createBoard));
          console.log("createBoard : " + JSON.stringify(createBoard.idx));
          console.log("updateAuth : " + JSON.stringify(updateAuth));

          //주기적으로 전송하기
          let senddata = {
            userIdx:origindata.userIdx, 
            maxTemp:origindata.maxTemp, 
            minTemp:origindata.minTemp,
            maxHumid:origindata.maxHumid, 
            minHumid:origindata.minHumid, 
          };

          pubtopic = searchAuth.boardSerial+"/setup/request/pico";

          console.log("제품코드 등록 요청::5");
          console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
          console.log("pubtopic : " + pubtopic);
          console.log("senddata : " + JSON.stringify(senddata));

          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_v);

          console.log("*****************************************::제품코드 등록 요청::*****************************************");
        }else{ 
          //이미 등록된 데이터가 있다고 app으로 publish
          let senddata = {
            message:Constants.REGIST_SERIALNUM,
            return:false,
          };
          client.publish(pubtopic, JSON.stringify(senddata), options_v);
        }
      }else{ //null
        //등록된 사용자 인증 코드가 없다고 app으로 publish
        let senddata = {
          message:Constants.CANNOT_FIND_AUTH,
          return:false,
        };
        client.publish(pubtopic, JSON.stringify(senddata), options_v);
      }
    }

    //제품코드 등록 응답 : useridx, boardSerial 조회 
    @MessagePattern('setup/response/nest')  
    async setupresponse(@pd() data: String) {
      console.log("*****************************************::제품코드 등록 응답::*****************************************");


      //userIdx, tempname 조회하여 체크
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      console.log("제품코드 등록 응답::1");
      console.log("origindata : " + origindata);

      //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
      //존재하지 않으면 false
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("제품코드 등록 응답::2");
      console.log("searchAuth : " + searchAuth);
      console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
      console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("제품코드 등록 응답::3");

        //주기적으로 전송하기
        let senddata = {
          type:1
        };

        pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/setup/response/app";

        console.log("제품코드 등록 응답::5");
        console.log("searchAuth.userIdx : " + searchAuth.userIdx);
        console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
        console.log("pubtopic : " + pubtopic);

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_v);

        console.log("*****************************************::제품코드 등록 응답::*****************************************");

       // return true;
      }else{//null
        //등록된 사용자 인증 코드가 없다고 app으로 publish
        let senddata = {
          message:Constants.CANNOT_FIND_AUTH,
          return:false,
        };
        client.publish(pubtopic, JSON.stringify(senddata), options_v);
      }
    }

    //온습도 세팅 요청 : userIdx, tempname 조회
    @MessagePattern('temphumid/setrequest/nest')  
    async settemphumidrequest(@pd() data: String) {
      
      console.log("*****************************************::온도 세팅 요청::*****************************************");

      //userIdx, tempname 조회하여 체크

      //json이 아닌경우 값을 파싱 못한다. undefined 형태로 파싱됨.
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      console.log("온도 세팅 요청::1");
      console.log("origindata : " + origindata);
      console.log("origindata.userIdx : " + origindata.userIdx);
      console.log("origindata.tempname : " + origindata.tempname);

      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);

      console.log("온도 세팅 요청::2");
      console.log("searchAuth : " + searchAuth);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("온도 세팅 요청::3");

        //json 데이터 생성
        const updateiotData = {
          maxTemp:origindata.maxTemp, 
          minTemp:origindata.minTemp,
          maxHumid:origindata.maxHumid, 
          minHumid:origindata.minHumid, 
        }

        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);

        console.log("온도 세팅 요청::4");
        console.log("updateBoard : " + updateBoard);
        
        //주기적으로 전송하기
        let senddata = {
          maxTemp:origindata.maxTemp, 
          minTemp:origindata.minTemp,
          maxHumid:origindata.maxHumid, 
          minHumid:origindata.minHumid, 
        };
        
        pubtopic = searchAuth.boardSerial+"/temphumid/setrequest/pico";

        console.log("온도 세팅 요청::5");
        console.log("boardSerial : " + searchAuth.boardSerial);
        console.log("pubtopic : " + pubtopic);
        console.log("senddata : " + JSON.stringify(senddata));

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_v);

        
        console.log("*****************************************::온도 세팅 요청::*****************************************");
        //return true;
      }else{//null
        //등록된 사용자 인증 코드가 없다고 app으로 publish
        let senddata = {
          message:Constants.CANNOT_FIND_AUTH,
          return:false,
        };
        client.publish(pubtopic, JSON.stringify(senddata), options_v);
      }
    }

      //온습도 세팅 응답 : useridx, boardSerial 조회 
      @MessagePattern('temphumid/setresponse/nest')  
      async settemphumidresponse(@pd() data: String) {

        console.log("*****************************************::온습도 세팅 응답::*****************************************");
        //userIdx, boardSerial 조회하여 체크
        let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

        console.log("온습도 세팅 응답::1");
        console.log("origindata : " + origindata);
        console.log("origindata.userIdx : " + origindata.userIdx);
        console.log("origindata.tempname : " + origindata.tempname);

        //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
        //존재하지 않으면 false
        const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);
  
        console.log("온습도 세팅 응답::2");
        console.log("searchAuth : " + searchAuth);
        console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
  
        if (searchAuth) {
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("온습도 세팅 응답::3");
  
          //주기적으로 전송하기
          let senddata = {
            type:1
          };
  
          pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/temphumid/setresponse/app";
  
          console.log("온습도 세팅 응답::5");
          console.log("searchAuth.userIdx : " + searchAuth.userIdx);
          console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
          console.log("pubtopic : " + pubtopic);
          console.log("senddata : " + JSON.stringify(senddata));

          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_v);

          console.log("*****************************************::온습도 세팅 응답::*****************************************");

        }else{//null
          //등록된 사용자 인증 코드가 없다고 app으로 publish
          let senddata = {
            message:Constants.CANNOT_FIND_AUTH,
            return:false,
          };
          client.publish(pubtopic, JSON.stringify(senddata), options_v);
        }
      }

    //온습도 응답 : userIdx, boardSerial 조회
    @MessagePattern('temphumid/getresponse/nest')  
    async getresponsetemphumid(@pd() data: String) {

      console.log("*****************************************::온습도 응답::*****************************************");
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      console.log("온습도 응답::1");
      console.log("origindata : " + origindata);
      console.log("origindata.userIdx : " + origindata.userIdx);
      console.log("origindata.boardSerial : " + origindata.boardSerial);
			
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("온습도 응답::2");
      console.log("searchAuth : " + searchAuth);

      if (searchAuth) {

        console.log("온습도 응답::3");

        //주기적으로 전송하기
        let senddata = {
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
          current2Temp: origindata.current2Temp,
          current2Humid: origindata.current2Humid,
          type:origindata.type,
        };

        //json 데이터 생성
        const updateiotData = {
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
          current2Temp: origindata.current2Temp,
          current2Humid: origindata.current2Humid,
        }
        //현재 온습도 업데이트
        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);
        console.log(updateBoard);
        
        //json 데이터 생성
        const creatNatureData = {
          boardIdx: searchAuth.boardIdx,
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
          current2Temp: origindata.current2Temp,
          current2Humid: origindata.current2Humid,
          type: origindata.type,
        }
        //온습도 추가  ****************
        const createIotNature = await this.mqttService.createIotnaturerecord(JSON.parse(JSON.stringify(creatNatureData)));
        console.log("온습도 응답::4");
        console.log("createIotNature : " + createIotNature);

        pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/temphumid/getresponse/app";

        console.log("온습도 응답::5");
        console.log("searchAuth.userIdx : " + searchAuth.userIdx);
        console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
        console.log("pubtopic : " + pubtopic);
        console.log("senddata : " + JSON.stringify(senddata));
        

        //type 2일때만 publish하도록 변경.
        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_v);
        
        console.log("*****************************************::온습도 응답::*****************************************");
      }else{//null
        //등록된 사용자 인증 코드가 없다고 app으로 publish
        let senddata = {
          message:Constants.CANNOT_FIND_AUTH,
          return:false,
        };
        client.publish(pubtopic, JSON.stringify(senddata), options_v);
      }
    }
      //온습도 요청 : useridx, tempname 조회 
      @MessagePattern('temphumid/getrequest/nest')  
      async getrequesttemphumid(@pd() data: String) {

        console.log("*****************************************::온습도 요청::*****************************************");

        console.log("온습도 요청::1");
  
        //userIdx, tempname 조회하여 체크
        let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

        console.log("온습도 요청::1");
        console.log("origindata : " + origindata);
        console.log("origindata.userIdx : " + origindata.userIdx);
        console.log("origindata.tempname : " + origindata.tempname);

        //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
        //존재하지 않으면 false
        const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);
  
        console.log("온습도 요청::2");
        console.log("searchAuth : " + searchAuth);
        console.log("searchAuth.tempname : " + searchAuth.tempname);

        if (searchAuth) {
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("온습도 요청::3");
  
          //주기적으로 전송하기
          let senddata = {
            type:origindata.type
          };
  
          pubtopic = searchAuth.boardSerial+"/temphumid/getrequest/pico";
          console.log("온습도 요청::5");
          console.log("searchAuth.userIdx : " + searchAuth.userIdx);
          console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
          console.log("pubtopic : " + pubtopic);
          console.log("senddata : " + JSON.stringify(senddata));


          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_v);

          console.log("*****************************************::온습도 요청::*****************************************");

        }else{//null
          //등록된 사용자 인증 코드가 없다고 app으로 publish
          let senddata = {
            message:Constants.CANNOT_FIND_AUTH,
            return:false,
          };
          client.publish(pubtopic, JSON.stringify(senddata), options_v);
        }
      }


    //제어모듈 응답 : useridx, boardSerial 조회 
    @MessagePattern('controlm/getresponse/nest')  
    async updatelightset(@pd() data: String) {

      console.log("*****************************************::제어모듈 응답::*****************************************");
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
      console.log("제어모듈 응답::1");
      console.log("origindata : " + JSON.stringify(origindata));

      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("제어모듈 응답::2");
      console.log("searchAuth : " + JSON.stringify(searchAuth));

      if (searchAuth) {

        console.log("제어모듈 응답::3");
        console.log("origindata : " + origindata);
        console.log("origindata.Commanded_Function : " + origindata.Commanded_Function);
        console.log("origindata.type : " + origindata.type);

        //업데이트할 데이터 생성
        const updateiotData = {
          currentLight:false,
        }

        //변경되는 데이터 수정
        if(origindata.Commanded_Function == "UVB_ON"){
          console.log("origindata.UVB_ON");
          updateiotData.currentLight = true;
        }else if(origindata.Commanded_Function == "UVB_OFF"){
          console.log("origindata.UVB_OFF");
          updateiotData.currentLight = false;
        }else if(origindata.Commanded_Function == "COOLINGFAN_ON"){
          console.log("origindata.COOLINGFAN_ON");
          delete updateiotData.currentLight;
        }else if(origindata.Commanded_Function == "WATERPUMP_ON"){
          console.log("origindata.WATERPUMP_ON");
          delete updateiotData.currentLight;
        }

        console.log("제어모듈 응답::4");
        console.log("updateiotData : " + updateiotData);

        //현재 제어모듈 상태 업데이트
        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);
        console.log("updateBoard : " + updateBoard);

        //creatControlData 를 수정 : 받아온 데이터중 널이 존재하면 currentControlinfo 여기서 데이터로 변경해줄 것

        console.log("제어모듈 응답::5");

        //최근 제어모듈 데이터 가져오기
        const currentControlinfo = await this.mqttService.getIotcontrolinfo(searchAuth.boardIdx);
        console.log("currentControlinfo : " + currentControlinfo);

        //json 데이터 생성
        const creatControlData = {
          boardIdx: searchAuth.boardIdx,
          light:false,
          waterpump:false,
          coolingfan:false,
          type: origindata.type,
        }

        //최근 데이터가 있는 경우
        if(currentControlinfo != null){
          creatControlData.light = currentControlinfo.light;
          creatControlData.coolingfan = false;
          creatControlData.waterpump = false;
        }else{ //최근 데이터가 없는 경우
          creatControlData.light = false;
          creatControlData.coolingfan = false;
          creatControlData.waterpump = false;
        }

        //변경되는 데이터 수정
        if(origindata.Commanded_Function == "UVB_ON"){
          console.log("UVB_ON");
          creatControlData.light = true;
        }else if(origindata.Commanded_Function == "UVB_OFF"){
          console.log("UVB_OFF");
          creatControlData.light = false;
        }else if(origindata.Commanded_Function == "COOLINGFAN_ON"){
          console.log("COOLINGFAN_ON");
          creatControlData.coolingfan = true;
        }else if(origindata.Commanded_Function == "WATERPUMP_ON"){
          console.log("WATERPUMP_ON");
          creatControlData.waterpump = true;
        }

        console.log("제어모듈 응답::6");

        // 제어모듈 추가  ****************
        const createIotControl = await this.mqttService.createIotcontrolrecord(JSON.parse(JSON.stringify(creatControlData)));

        
        //publish할 데이터 
        let senddata = {
          Commanded_Function:origindata.Commanded_Function,
          type:origindata.type,
          result:true,
        };

        console.log("제어모듈 응답::7");
        console.log("createIotControl : " + createIotControl);
        console.log("senddata : " + JSON.stringify(senddata));

        pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/controlm/getresponse/app";
        console.log("제어모듈 응답::8");    

        console.log("searchAuth.userIdx : " + searchAuth.userIdx);
        console.log("searchAuth.boardTempname : " + searchAuth.boardTempname);
        console.log("pubtopic : " + pubtopic);
        console.log("senddata : " + JSON.stringify(senddata));
        
        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_v);

        console.log("*****************************************::제어모듈 응답::*****************************************");
      }else{//null
        //등록된 사용자 인증 코드가 없다고 app으로 publish
        let senddata = {
          message:Constants.CANNOT_FIND_AUTH,
          return:false,
        };
        client.publish(pubtopic, JSON.stringify(senddata), options_v);
      }
    }

      //제어모듈 요청 : useridx, tempname 조회 
      @MessagePattern('controlm/getrequest/nest')  
      async getrequestcontrolm(@pd() data: String) {

        console.log("*****************************************::제어모듈 요청::*****************************************");

        console.log("제어모듈 요청::1");
  
        //userIdx, tempname 조회하여 체크
        let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

        console.log("제어모듈 요청::1");
        console.log("origindata : " + origindata);

  
        //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
        //존재하지 않으면 false
        const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);
  
        console.log("제어모듈 요청::2");
        console.log("searchAuth : " + searchAuth);
        console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
  
        if (searchAuth) {
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("제어모듈 요청::3");
        
          //주기적으로 전송하기
          let senddata = {
            Commanded_Function:origindata.Commanded_Function, //passive
            type:origindata.type //passive
          };
  
          pubtopic = searchAuth.boardSerial+"/controlm/getrequest/pico";
  
          console.log("제어모듈 요청::5");
          console.log("searchAuth.boardSerial : " + searchAuth.boardSerial);
          console.log("pubtopic : " + pubtopic);
          console.log("senddata : " + JSON.stringify(senddata));


          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_v);
  
          console.log("*****************************************::제어모듈 요청::*****************************************");

        }else{//null
          //등록된 사용자 인증 코드가 없다고 app으로 publish
          let senddata = {
            message:Constants.CANNOT_FIND_AUTH,
            return:false,
          };
          client.publish(pubtopic, JSON.stringify(senddata), options_v);
        }
      }



    


      @MessagePattern('hello')  //구독하는 주제1
      testtt(@pd() data: String, @Ctx() context: MqttContext){
        return this.mqttService.testtest(data);
      }
}