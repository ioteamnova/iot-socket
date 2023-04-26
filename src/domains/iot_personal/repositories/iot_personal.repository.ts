import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Iot_personal } from '../entities/iot_personal.entity';

//쿼리문 만드는 곳 

@CustomRepository(Iot_personal)
export class Iot_personalRepository extends Repository<Iot_personal> {
  // async existByEmail(email: string): Promise<boolean> {
  //   const existEmail = await this.exist({
  //     where: {
  //       email,
  //     },
  //   });
  //   return existEmail;
  // }
}
