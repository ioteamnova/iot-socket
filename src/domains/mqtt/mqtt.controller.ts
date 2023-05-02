import { Body, Controller, Get, Param, Post, Query, Res  } from '@nestjs/common';
import { MqttService } from "./mqtt.service";
import { CreateIotPersonalDto } from '../iot_personal/dtos/create-Iotpersonal.dto';
import { CreateIotNaturerecordDto } from '../iot_naturerecord/dtos/create-Iotnaturerecord.dto';
import { CreateIotControlrecordDto } from '../iot_controlrecord/dtos/create-Iotcontrolrecord.dto';
import { MessagePattern, Payload as pd, ClientProxy, Ctx, MqttContext, MqttRecordBuilder, NatsContext, Client, Transport} from '@nestjs/microservices';
const fs = require('fs');

//nodejs mqtt 로 만든 코드
var mqtt = require('mqtt');

const clientKey = fs.readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_key.pem');
const clientCert = fs.readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_crt.crt');
const caCert = fs.readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/ca.crt');

// const clientKey = fs.readFileSync('/etc/mosquitto/CA/client_key.pem');
// const clientCert = fs.readFileSync('/etc/mosquitto/CA/client_crt.crt');
// const caCert = fs.readFileSync('/etc/mosquitto/CA/ca.crt');

const options = {
  host: process.env.SERVERIP,
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
      console.log("setup request::1");

      //userIdx, tempname 조회하여 체크
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
      //let useridx = origindata.userIdx; //user idx
      //let tempname = origindata.tempname; //제품 임시 번호

      //delete origindata.userIdx;
      //delete origindata.tempname;

      //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
      //존재하지 않으면 false
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);

      console.log("setup request::2");
      console.log(searchAuth);
      console.log(searchAuth.boardSerial);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("setup request::3");

        

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

        console.log("setup request::4");
        console.log(createBoard);

        //전송할 데이터 세팅
        let options_={
          retain:true,
          qos:2};

        //주기적으로 전송하기
        let senddata = {
          userIdx:origindata.userIdx, 
          maxTemp:origindata.maxTemp, 
          minTemp:origindata.minTemp,
          maxHumid:origindata.maxHumid, 
          minHumid:origindata.minHumid, 
        };

        let pubtopic = searchAuth.boardSerial+"/setup/request/pico";

        console.log("setup request::5");
        console.log(searchAuth.boardSerial);
        console.log(pubtopic);

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_);

        return true;
      }
    }

    //제품코드 등록 응답 : useridx, boardSerial 조회 
    @MessagePattern('setup/response/nest')  
    async setupresponse(@pd() data: String) {
      

      //userIdx, tempname 조회하여 체크
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      console.log("setup response::1");
      console.log(origindata);

      //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
      //존재하지 않으면 false
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("setup response::2");
      console.log(searchAuth);
      console.log(searchAuth.boardSerial);
      console.log(searchAuth.boardTempname);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("setup response::3");
      

        //전송할 데이터 세팅
        let options_={
          retain:true,
          qos:2};

        //주기적으로 전송하기
        let senddata = {
          type:1
        };

        let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/setup/response/app";

        console.log("setup response::5");
        console.log(searchAuth.userIdx);
        console.log(searchAuth.boardTempname);
        console.log(pubtopic);

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_);

        return true;
      }
    }

    //온습도 세팅 요청 : userIdx, tempname 조회
    @MessagePattern('temphumid/setrequest/nest')  
    async settemphumidrequest(@pd() data: String) {
      
      
      //userIdx, tempname 조회하여 체크

      //json이 아닌경우 값을 파싱 못한다. undefined 형태로 파싱됨.
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      console.log("temphumid setrequest::1");
      console.log(origindata);
      console.log(origindata.userIdx);
      console.log(origindata.tempname);

      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);

      console.log("temphumid setrequest::2");
      console.log(searchAuth);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("temphumid setrequest::3");

        //json 데이터 생성
        const updateiotData = {
          maxTemp:origindata.maxTemp, 
          minTemp:origindata.minTemp,
          maxHumid:origindata.maxHumid, 
          minHumid:origindata.minHumid, 
        }

        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);

        console.log("temphumid setrequest::4");
        console.log(updateBoard);

        //전송할 데이터 세팅
        let options_={
          retain:true,
          qos:2};

        
        //주기적으로 전송하기
        let senddata = {
          maxTemp:origindata.maxTemp, 
          minTemp:origindata.minTemp,
          maxHumid:origindata.maxHumid, 
          minHumid:origindata.minHumid, 
        };
        
        let pubtopic = searchAuth.boardSerial+"/temphumid/setrequest/pico";

        console.log("temphumid setrequest::5");
        console.log(searchAuth.boardSerial);
        console.log(pubtopic);

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_);

        
        return true;
      }
    }

      //온습도 세팅 응답 : useridx, boardSerial 조회 
      @MessagePattern('temphumid/setresponse/nest')  
      async settemphumidresponse(@pd() data: String) {
        console.log("temphumid setresponse::1");
  
        //userIdx, boardSerial 조회하여 체크
        let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
        console.log(origindata);
        console.log(origindata.userIdx);
        console.log(origindata.tempname);

        //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
        //존재하지 않으면 false
        const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);
  
        console.log("temphumid setresponse::2");
        console.log(searchAuth);
        console.log(searchAuth.boardSerial);
  
        if (searchAuth) {
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("temphumid setresponse::3");
        
  
          //전송할 데이터 세팅
          let options_={
            retain:true,
            qos:2};
  
          //주기적으로 전송하기
          let senddata = {
            type:1
          };
  
          let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/temphumid/setresponse/app";
  
          console.log("temphumid setresponse::5");
          console.log(searchAuth.userIdx);
          console.log(searchAuth.boardTempname);
          console.log(pubtopic);

          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_);
  
          return true;
        }
      }

    //온습도 응답 : userIdx, boardSerial 조회
    @MessagePattern('temphumid/getresponse/nest')  
    async getresponsetemphumid(@pd() data: String) {
      console.log("temphumid getresponse::1");
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
      console.log(origindata);
      console.log(origindata.userIdx);
      console.log(origindata.boardSerial);
			
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("temphumid getresponse::2");
      console.log(searchAuth);

      if (searchAuth) {

        console.log("temphumid getresponse::3");

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
        console.log(createIotNature);
        console.log("temphumid getresponse::4");

        //전송할 데이터 세팅
        let options_={
          retain:true,
          qos:2};

        let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/temphumid/getresponse/app";

        console.log("temphumid getresponse::5");
        console.log(searchAuth.userIdx);
        console.log(searchAuth.boardTempname);
        console.log(pubtopic);

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_);

        //type 2일때만 publish하도록 변경.

        return true;
      }
    }
      //온습도 요청 : useridx, tempname 조회 
      @MessagePattern('temphumid/getrequest/nest')  
      async getrequesttemphumid(@pd() data: String) {
        console.log("temphumid getrequest::1");
  
        //userIdx, tempname 조회하여 체크
        let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
        console.log(origindata);
        console.log(origindata.userIdx);
        console.log(origindata.tempname);

        //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
        //존재하지 않으면 false
        const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);
  
        console.log("temphumid getrequest::2");
        console.log(searchAuth);
        console.log(searchAuth.tempname);
  
        if (searchAuth) {
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("temphumid getrequest::3");
        
  
          //전송할 데이터 세팅
          let options_={
            retain:true,
            qos:2};
  
          //주기적으로 전송하기
          let senddata = {
            type:2
          };
  
          let pubtopic = searchAuth.boardSerial+"/temphumid/getrequest/pico";
          console.log("temphumid getrequest::5");
          console.log(searchAuth.userIdx);
          console.log(searchAuth.boardSerial);
          console.log(pubtopic);

          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_);


          return true;
        }
      }


    //제어모듈 응답 : useridx, boardSerial 조회 
    @MessagePattern('controlm/getresponse/nest')  
    async updatelightset(@pd() data: String) {
      console.log("controlm getresponse::1");
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("controlm getresponse::2");
      console.log(searchAuth);

      if (searchAuth) {

        console.log("controlm getresponse::3");

        console.log(origindata);
        console.log(origindata.Commanded_Function);
        // console.log(origindata.light);
        // console.log(origindata.waterpump);
        // console.log(origindata.coolingfan);
        console.log(origindata.type);

        //publish할 데이터 
        let senddata = {
          coolingfan:false,
          waterpump:false,
          light:false,
          type:origindata.type,
          result:false,
        };

        //업데이트할 데이터 생성
        const updateiotData = {
          coolingfan:false,
          waterpump:false,
          light:false,
        }

        //변경되는 데이터 수정
        if(origindata.Commanded_Function == "UVB_ON"){
          console.log("origindata.coolingfan");

          senddata.light = true;

          delete updateiotData.coolingfan;
          delete senddata.coolingfan;
          delete updateiotData.waterpump;
          delete senddata.waterpump;

        }else if(origindata.Commanded_Function == "UVB_OFF"){
          console.log("origindata.waterpump");

          senddata.light = false;

          delete updateiotData.coolingfan;
          delete senddata.coolingfan;
          delete updateiotData.waterpump;
          delete senddata.waterpump;

        }else if(origindata.Commanded_Function == "COOLINGFAN_ON"){

          senddata.coolingfan = true;

          delete updateiotData.light;
          delete senddata.light;
          delete updateiotData.waterpump;
          delete senddata.waterpump;

        }else if(origindata.Commanded_Function == "WATERPUMP_ON"){
          console.log("origindata.light");

          senddata.waterpump = true;

          delete updateiotData.coolingfan;
          delete senddata.coolingfan;
          delete updateiotData.light;
          delete senddata.light;

        }

        //현재 제어모듈 상태 업데이트
        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);
        console.log(updateBoard);

        //creatControlData 를 수정 : 받아온 데이터중 널이 존재하면 currentControlinfo 여기서 데이터로 변경해줄 것

        //최근 제어모듈 데이터 가져오기
        const currentControlinfo = await this.mqttService.getIotcontrolinfo(searchAuth.boardIdx);
        console.log("currentControlinfo");
        console.log(currentControlinfo);

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
          creatControlData.coolingfan = currentControlinfo.coolingfan;
          creatControlData.waterpump = currentControlinfo.waterpump;
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

        // 제어모듈 추가  ****************
        const createIotControl = await this.mqttService.createIotcontrolrecord(JSON.parse(JSON.stringify(creatControlData)));
        console.log(createIotControl);
        console.log("controlm getresponse::4");
        
        //전송할 데이터 세팅
        let options_={
          retain:true,
          qos:2};
        
        senddata.result = true;

        let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardTempname+"/controlm/getresponse/app";
        console.log("temphumid getresponse::5");    
        console.log(searchAuth.userIdx);
        console.log(searchAuth.boardTempname);
        console.log(pubtopic);  // 수정
        
        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_);


        return true;
      }
    }

      //제어모듈 요청 : useridx, tempname 조회 
      @MessagePattern('controlm/getrequest/nest')  
      async getrequestcontrolm(@pd() data: String) {
        console.log("controlm getrequest::1");
  
        //userIdx, tempname 조회하여 체크
        let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
  
        //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
        //존재하지 않으면 false
        const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);
  
        console.log("controlm getrequest::2");
        console.log(searchAuth);
        console.log(searchAuth.boardSerial);
  
        if (searchAuth) {
          //데이터가 존재한다면 iot_personal에 저장할 것. 
          console.log("controlm getrequest::3");
        
  
          //전송할 데이터 세팅
          let options_={
            retain:true,
            qos:2};
  
          //주기적으로 전송하기
          let senddata = {
            type:2 //passive
          };
  
          let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardSerial+"/controlm/getrequest/pico";
  
          console.log("controlm getrequest::5");
          console.log(searchAuth.userIdx);
          console.log(searchAuth.boardSerial);
          console.log(pubtopic);

          //publish 생성
          client.publish(pubtopic, JSON.stringify(senddata), options_);
  
          return true;
        }
      }



      








      @MessagePattern('hello')  //구독하는 주제1
      testtt(@pd() data: String, @Ctx() context: MqttContext){
        return this.mqttService.testtest(data);
      }


}

//여기서 데이터 구독 받아서 처리 