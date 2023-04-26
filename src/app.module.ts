import { Module } from '@nestjs/common';
import { MqttModule } from './domains/mqtt/mqtt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
//import { LoggerMiddleware } from './core/middlewares/logger.middleware';

import { User } from './domains/user/entities/user.entity';
import { Iot_personal } from './domains/iot_personal/entities/iot_personal.entity';
import { Iot_authinfo } from './domains/iot_authinfo/entities/iot_authinfo.entity';
import { Iot_naturerecord } from './domains/iot_naturerecord/entities/iot_naturerecord.entity';
import { Iot_controlrecord } from './domains/iot_controlrecord/entities/iot_controlrecord.entity';

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
      entities: [User, Iot_personal, Iot_authinfo, Iot_naturerecord, Iot_controlrecord], // 사용할 entity의 클래스명을 넣어둔다.
      synchronize: false, // false로 해두는 게 안전하다.
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    MqttModule
  ],

})
export class AppModule {}
