import { Module } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { Iot_personalRepository } from '../iot_personal/repositories/iot_personal.repository';
import { Iot_authinfoRepository } from '../iot_authinfo/repositories/iot_authinfo.repository';
import { Iot_naturerecordRepository } from '../iot_naturerecord/repositories/iot_naturerecord.repository';
import { Iot_controlrecordRepository } from '../iot_controlrecord/repositories/iot_controlrecord.repository';

import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, Iot_personalRepository, Iot_authinfoRepository, Iot_naturerecordRepository, Iot_controlrecordRepository, ]),
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService, TypeOrmExModule],
})
export class MqttModule {}
