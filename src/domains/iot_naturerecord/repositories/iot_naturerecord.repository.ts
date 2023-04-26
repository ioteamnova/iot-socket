import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Iot_naturerecord } from '../entities/iot_naturerecord.entity';

//쿼리문 만드는 곳 

@CustomRepository(Iot_naturerecord)
export class Iot_naturerecordRepository extends Repository<Iot_naturerecord> {
  // async existByEmail(email: string): Promise<boolean> {
  //   const existEmail = await this.exist({
  //     where: {
  //       email,
  //     },
  //   });
  //   return existEmail;
  // }
}
