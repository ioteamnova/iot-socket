import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
// import { MqttController } from './mqtt/mqtt.controller';
// import { MqttModule } from './mqtt/mqtt.module';
// import { MqttService } from './mqtt/mqtt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  //imports: [AppModule],
  imports: [
    ClientsModule.register([
      {
        name: 'topic',  //* MY_MQTT_SERVICE : 의존성 이름
        transport: Transport.MQTT,
        options: {
          host: 'localhost',
          port: 1883,
          clientId : 'id',
          password : 'password'
        }
      }
    ]),
  ],

  controllers: [ AppController],
  providers: [AppService],
})
export class AppModule {}
