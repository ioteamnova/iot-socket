import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';

import { MessagePattern, Payload as pd, ClientProxy } from '@nestjs/microservices';
import {take} from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }


  // constructor(@Inject('topic') private client : ClientProxy) { //* MY_MQTT_SERVICE : 의존성 이름
  //   setTimeout(() => {  //3초뒤에 메시지를 발송하게 하였습니다.
  //     const data = {number : Math.random(), text : AppController.name};
  //     this.client.send('Korean',data).pipe(take(1)).subscribe();      
  //   }, 1000);
  // }


  @MessagePattern('topic')  //구독하는 주제1
  모두받기(@pd() data){
    return this.appService.getMQTT(data);
  }


  @MessagePattern('American')  //구독하는 주제2
  고유받기(@pd() data){
    console.log(data);
  }  


}
