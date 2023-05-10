import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { IotBoardPersonal } from '../entities/iot-board-personal.entity';

//쿼리문 만드는 곳 

@CustomRepository(IotBoardPersonal)
export class IotBoardPersonalRepository extends Repository<IotBoardPersonal> {
}
