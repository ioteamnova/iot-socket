import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {MqttController} from './mqtt.controller';


const clients = ClientsModule.register([
  {
    name: 'humphrey', //* MY_MQTT_SERVICE : 의존성 이름
    transport: Transport.MQTT,
    options: {
      host: 'localhost',
      port: 1883,
      //clientId : 'id',
      //password : 'password'
    }
  }
]);

@Module({
  imports: [
    clients
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports : [clients]
})
export class MqttModule {

}
