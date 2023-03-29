import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';

//const mqtt = require('mqtt');
//const client = mqtt.connect('mqtt://test.mosquitto.org');


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      host: 'localhost',
      port: 1883,
      //host:client,
      //url: 'mqtt://localhost:1883',
    },
  });
  app.listen();

  //const app = await NestFactory.create(AppModule);
  //await app.listen(3000);
}
bootstrap();
