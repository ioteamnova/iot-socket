import { Injectable } from '@nestjs/common';

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');


@Injectable()
export class AppService {
  getHello(): string {

    console.log("start nest");
    // setInterval(
    //   ()=>{
    //     client.publich('topic', "hello cre");

    //   }, 
    //   2000
    // );
    return 'Hello World! im jihun!!!!12312312313211111.. 1232123ttt';
  }

  getMQTT(data:string) {

    //db통신 처리 
    console.log("get mosquitto data");
    console.log(data);
    //return;
  }
}
