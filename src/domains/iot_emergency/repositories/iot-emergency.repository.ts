import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { IotEmergency } from '../entities/iot-emergency.entity';

//쿼리문 만드는 곳 

@CustomRepository(IotEmergency)
export class IotEmergencyRepository extends Repository<IotEmergency> { }
