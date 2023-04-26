import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Iot_controlrecord } from '../entities/iot_controlrecord.entity';

//쿼리문 만드는 곳 

@CustomRepository(Iot_controlrecord)
export class Iot_controlrecordRepository extends Repository<Iot_controlrecord> {
  // async existByEmail(email: string): Promise<boolean> {
  //   const existEmail = await this.exist({
  //     where: {
  //       email,
  //     },
  //   });
  //   return existEmail;
  // }
}
