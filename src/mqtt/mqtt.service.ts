import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {
    // getHello(): string {
    //     return 'mqtt hello';
    // }

    getMQTT(): string{
        console.log("123");
        return 'get mqtt!';
    }
}
