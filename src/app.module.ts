import { Module } from '@nestjs/common';
import { MqttModule } from './domains/mqtt/mqtt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
//import { LoggerMiddleware } from './core/middlewares/logger.middleware';

import { User } from './domains/user/entities/user.entity';
import { IotBoardPersonal } from './domains/iot_board_personal/entities/iot-board-personal.entity';
import { IotAuthInfo } from './domains/iot_auth_info/entities/iot-auth-info.entity';
import { IotNatureRecord } from './domains/iot_nature_record/entities/iot-nature-record.entity';
import { IotControlRecord } from './domains/iot_control_record/entities/iot-control-record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.prod.env',
      // todo: 환경 변수 유효성 검사 joi
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DATABASE,
      entities: [User, IotBoardPersonal, IotAuthInfo, IotNatureRecord, IotControlRecord], // 사용할 entity의 클래스명을 넣어둔다.
      synchronize: false, // false로 해두는 게 안전하다.
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    MqttModule
  ],

})
export class AppModule {}
