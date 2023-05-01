import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { readFileSync } from 'fs';

async function bootstrap() {
  const clientKey = readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_key.pem');
  const clientCert = readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_crt.crt');
  const caCert = readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/ca.crt');

    //subscribe시 연결
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.MQTT,
      options: {
        url: process.env.SERVERHOST,
        clientId: 'server_nestjs',
        protocol: 'mqtt',
        rejectUnauthorized: false,
        //username : 'ioteamnova',
        //password : '1234',
        subscribeOptions:{
          qos: 2,
        },
        key: clientKey,
        cert: clientCert,
        ca: [caCert],
      },
    });

  //const app = await NestFactory.create(AppModule);
  //lib사용하여 데이터 검증하는 부분
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.listen();
  //await app.listen(3000);
}
bootstrap();
