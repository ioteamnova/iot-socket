import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { IotAuthInfo } from '../entities/iot-auth-info.entity';

//쿼리문 만드는 곳 

@CustomRepository(IotAuthInfo)
export class IotAuthInfoRepository extends Repository<IotAuthInfo> {}
