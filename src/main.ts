import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { readFileSync } from 'fs';
// import { setupSwagger } from './core/swagger';


async function bootstrap() {
  const clientKey = readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_key.pem');
  const clientCert = readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/client_crt.crt');
  const caCert = readFileSync('/Users/humphrey/Documents/mqtt_server_ssl/ca.crt');
/*
  서버
  const clientKey = readFileSync('/etc/mosquitto/CA/client_key.pem');
  const clientCert = readFileSync('/etc/mosquitto/CA/client_crt.crt');
  const caCert = readFileSync('/etc/mosquitto/CA/ca.crt');
**/


    //subscribe시 연결
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.MQTT,
      options: {
        //url: "mqtts://43.201.185.236:8883",
        url: process.env.SERVERHOST,
        clientId: 'server_nestjs_sub',
        protocol: 'mqtts',
        rejectUnauthorized: false,
        //username : 'ioteamnova',
        //password : '1234',
        subscribeOptions:{
          qos: 2,
        },
        key: [clientKey],
        cert: [clientCert],
        ca: [caCert],
      },
    });

  //const app = await NestFactory.create(AppModule);
  //lib사용하여 데이터 검증하는 부분
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 스웨거 시작
  // initSwagger(app);

  app.listen();
  //await app.listen(3000);
}
bootstrap();
