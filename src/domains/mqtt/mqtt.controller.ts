import { Body, Controller, Get, Param, Post, Query, Res  } from '@nestjs/common';
import { MqttService } from "./mqtt.service";
import { CreateIotPersonalDto } from '../iot_personal/dtos/create-Iotpersonal.dto';
import { CreateIotNaturerecordDto } from '../iot_naturerecord/dtos/create-Iotnaturerecord.dto';
import { CreateIotControlrecordDto } from '../iot_controlrecord/dtos/create-Iotcontrolrecord.dto';
import { MessagePattern, Payload as pd, ClientProxy, Ctx, MqttContext, MqttRecordBuilder, NatsContext, Client, Transport} from '@nestjs/microservices';

//nodejs mqtt 로 만든 코드

var mqtt = require('mqtt')
const options = {
  host: process.env.SERVERHOST,
  protocol: 'mqtt', //mqtts가 되면  read ECONNRESET 라고 뜬다.
  //username:"ioteamnova",
  //password:"1234",
};
const client = mqtt.connect(options);

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
  var senddata = {
    userIdx:1, //서칭 데이터
    currentTemp:29.9, 
    currentHumid:41.2,
    type:2, //1. auto, 2. passive 
    boardSerial:"123efwe4894wfwef111", //서칭 데이터
  }; 

    //제어모듈 통신 auto pub
    // var senddata = {
    //   userIdx:1, //서칭 데이터
    //   light:false, 
    //   //waterpump:false,
    //   //coolingfan:true,
    //   type:1, //1. auto, 2. passive 
    //   boardSerial:"123efwe4894wfwef", //서칭 데이터
    // }; 

  var options_={
    retain:true,
    qos:2};


 // var senddata = "macbook 온도 제어 데이터 : 3";
  function intervalFunc() {
   //-********-//
    //제품코드 등록 pub
    //client.publish("setup/setup/nest", JSON.stringify(senddata), options_);
    //console.log("***setup pub::1");

    //온습도 세팅 pub
    //client.publish("temphumid/set/nest", JSON.stringify(senddata), options_);
    //console.log("***temphumid_set pub::1");

    //온습도 auto pub
     client.publish("temphumid/get/nest", JSON.stringify(senddata), options_);
     console.log("***temphumid_get pub::1");

    //제어모듈 auto pub
    //client.publish("controlm/get/nest", JSON.stringify(senddata), options_);
    //console.log("***controlm_get pub::1");

  }

  intervalFunc();


@Controller()
export class MqttController {
    constructor(private readonly mqttService: MqttService) {}

    //제품코드 등록 : useridx, tempname 조회 
    //client.publish("setup/setup/nest", JSON.stringify(senddata2), options);
    @MessagePattern('setup/setup/nest')  
    async setup(@pd() data: String) {
      console.log("setup::1");

      //userIdx, tempname 조회하여 체크
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
      //let useridx = origindata.userIdx; //user idx
      //let tempname = origindata.tempname; //제품 임시 번호

      //delete origindata.userIdx;
      //delete origindata.tempname;

      //iot_authinfo 테이블에서 데이터 조회하여 데이터가 존재하면 true
      //존재하지 않으면 false
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);

      console.log("setup::2");
      console.log(searchAuth);
      console.log(searchAuth.boardSerial);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("setup::3");

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
        const createBoard = await this.mqttService.createIotPersonal(JSON.parse(JSON.stringify(createiotData)));

        console.log("setup::4");
        console.log(createBoard);



        // //전송할 데이터 세팅
        // let options_={
        //   retain:true,
        //   qos:2};

        // //주기적으로 전송하기
        // let senddata = {
        //   userIdx:origindata.userIdx, 
        //   maxTemp:origindata.maxTemp, 
        //   minTemp:origindata.minTemp,
        //   maxHumid:origindata.maxHumid, 
        //   minHumid:origindata.minHumid, 
        // };

        // let pubtopic = searchAuth.boardSerial+"/setup/setup/pico";

        // //publish 생성
        // client.publish(pubtopic, JSON.stringify(senddata), options_);

        return true;
      }
    }

    //온습도 세팅
    @MessagePattern('temphumid/set/nest')  
    async updatetemphumidauto(@pd() data: String) {
      console.log("temphumid set::1");
      
      //userIdx, tempname 조회하여 체크

      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "tempname", origindata.tempname);

      console.log("temphumid set::2");
      console.log(searchAuth);

      if (searchAuth) {
        //데이터가 존재한다면 iot_personal에 저장할 것. 
        console.log("temphumid set::3");

        //json 데이터 생성
        const updateiotData = {
          maxTemp:origindata.maxTemp, 
          minTemp:origindata.minTemp,
          maxHumid:origindata.maxHumid, 
          minHumid:origindata.minHumid, 
        }

        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);

        console.log("temphumid set::4");
        console.log(updateBoard);

        // //전송할 데이터 세팅
        // let options_={
        //   retain:true,
        //   qos:2};

        //주기적으로 전송하기
        // let senddata = {
        //   maxTemp:origindata.maxTemp, 
        //   minTemp:origindata.minTemp,
        //   maxHumid:origindata.maxHumid, 
        //   minHumid:origindata.minHumid, 
        // };
        
        // let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardSerial+"/temphumid/set/pico";

        // //publish 생성
        // client.publish(pubtopic, JSON.stringify(senddata), options_);

        
        return true;
      }
    }

    //온습도 auto
    @MessagePattern('temphumid/get/nest')  
    async updatetemphumidset(@pd() data: String) {
      console.log("temphumid get::1");
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터
			
      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("temphumid get::2");
      console.log(searchAuth);

      if (searchAuth) {

        console.log("temphumid get::3");

        //주기적으로 전송하기
        let senddata = {
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
          type:origindata.type,
        };

        //json 데이터 생성
        const updateiotData = {
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
        }
        //현재 온습도 업데이트
        const updateBoard = await this.mqttService.upadateIotPersonal(JSON.parse(JSON.stringify(updateiotData)), searchAuth.boardIdx);
        console.log(updateBoard);
        
        //json 데이터 생성
        const creatNatureData = {
          boardIdx: searchAuth.boardIdx,
          currentTemp: origindata.currentTemp,
          currentHumid: origindata.currentHumid,
          type: origindata.type,
        }
        //온습도 추가  ****************
        const createIotNature = await this.mqttService.createIotnaturerecord(JSON.parse(JSON.stringify(creatNatureData)));
        console.log(createIotNature);
        console.log("temphumid get::4");

        //전송할 데이터 세팅
        let options_={
          retain:true,
          qos:2};

        let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardSerial+"/temphumid/get/app";

        //publish 생성
        client.publish(pubtopic, JSON.stringify(senddata), options_);


        return true;
      }
    }

    //제어모듈 auto
    @MessagePattern('controlm/get/nest')  
    async updatelightset(@pd() data: String) {
      console.log("controlm get::1");
      
      let origindata = JSON.parse(JSON.stringify(data)); //전체 데이터

      const searchAuth = await this.mqttService.chkAuthinfo(origindata.userIdx, "boardSerial", origindata.boardSerial);

      console.log("controlm get::2");
      console.log(searchAuth);

      if (searchAuth) {

        console.log("controlm get::3");

        console.log(origindata);
        console.log(origindata.light);
        console.log(origindata.waterpump);
        console.log(origindata.coolingfan);
        console.log(origindata.type);

        //publish할 데이터 
        let senddata = {
          coolingfan:origindata.coolingfan,
          waterpump:origindata.waterpump,
          light:origindata.light,
          type:origindata.type,
        };

        //업데이트할 데이터 생성
        const updateiotData = {
          coolingfan:origindata.coolingfan,
          waterpump:origindata.waterpump,
          light:origindata.light,
        }

        if(origindata.coolingfan == null){
          console.log("origindata.coolingfan");
          delete updateiotData.coolingfan;
          delete senddata.coolingfan;
        }
        
        if(origindata.waterpump == null){
          console.log("origindata.waterpump");
          delete updateiotData.waterpump;
          delete senddata.waterpump;
        }
        
        if(origindata.light == null){
          console.log("origindata.light");
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
          coolingfan:origindata.coolingfan,
          waterpump:origindata.waterpump,
          light:origindata.light,
          type: origindata.type,
        }
        //위에서 null이면 삭제함. 
        //아니면 다 가져온다음 전에 데이터 뒤져서 가져와서 넣어줘야함. 
        // console.log("creatControlData");
        // console.log(creatControlData);
        
        if(origindata.coolingfan == null){
          console.log("origindata.coolingfan");
          creatControlData.coolingfan = currentControlinfo.coolingfan;
        }
        
        if(origindata.waterpump == null){
          console.log("origindata.waterpump");
          creatControlData.waterpump = currentControlinfo.waterpump;
        }
        
        if(origindata.light == null){
          console.log("origindata.light");
          creatControlData.light = currentControlinfo.light;
        }

        // 제어모듈 추가  ****************
        const createIotControl = await this.mqttService.createIotcontrolrecord(JSON.parse(JSON.stringify(creatControlData)));
        console.log(createIotControl);
        console.log("temphumid get::4");


        // console.log("temphumid get::5");
        // console.log(updateiotData);
        // console.log(senddata);
        
        // //전송할 데이터 세팅
        // let options_={
        //   retain:true,
        //   qos:2};
        
        // let pubtopic = searchAuth.userIdx+"/"+searchAuth.boardSerial+"/controlm/get/app";

        // //publish 생성
        // client.publish(pubtopic, JSON.stringify(senddata), options_);


        return true;
      }
    }
}

//여기서 데이터 구독 받아서 처리 