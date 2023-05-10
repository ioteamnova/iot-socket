import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { IotControlRecord } from '../entities/iot-control-record.entity';

//쿼리문 만드는 곳 

@CustomRepository(IotControlRecord)
export class IotControlRecordRepository extends Repository<IotControlRecord> {}
