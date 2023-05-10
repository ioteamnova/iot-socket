import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { IotNatureRecord } from '../entities/iot-nature-record.entity';

//쿼리문 만드는 곳 

@CustomRepository(IotNatureRecord)
export class IotNatureRecordRepository extends Repository<IotNatureRecord> {}
