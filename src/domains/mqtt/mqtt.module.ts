import { Module } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { IotBoardPersonalRepository } from '../iot_board_personal/repositories/iot-board-personal.repository';
import { IotAuthInfoRepository } from '../iot_auth_info/repositories/iot-auth-info.repository';
import { IotNatureRecordRepository } from '../iot_nature_record/repositories/iot-nature-record.repository';
import { IotControlRecordRepository } from '../iot_control_record/repositories/iot-control-record.repository';

import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, IotBoardPersonalRepository, IotAuthInfoRepository, IotNatureRecordRepository, IotControlRecordRepository, ]),
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService, TypeOrmExModule],
})
export class MqttModule {}
