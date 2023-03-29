import { Controller, Inject } from '@nestjs/common';
import { MqttService } from './mqtt.service';

import { MessagePattern, Payload as pd, ClientProxy } from '@nestjs/microservices';
import {take} from 'rxjs';

@Controller()
export class MqttController {
    //constructor(private readonly appService: MqttService) {}

    // @Get()
    // getHello(): string {
    //   return this.appService.getHello();
    // }

    // @Get()
    // getMQTT(): string {
    //   return this.appService.getMQTT();
    // }

    constructor(@Inject('humphrey') private client : ClientProxy) { //* MY_MQTT_SERVICE : 의존성 이름
        setTimeout(() => {  //3초뒤에 메시지를 발송하게 하였습니다.
          const data = {number : Math.random(), text : MqttController.name};
          this.client.send('Korean',data).pipe(take(1)).subscribe();      
        }, 3000);
      }
    
    
      @MessagePattern('World')  //구독하는 주제1
      모두받기(@pd() data){
        console.log(data);
      }
    
    
      @MessagePattern('American')  //구독하는 주제2
      고유받기(@pd() data){
        console.log(data);
      }  
}
