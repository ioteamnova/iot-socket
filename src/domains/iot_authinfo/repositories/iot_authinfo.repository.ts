import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Iot_authinfo } from '../entities/iot_authinfo.entity';

//쿼리문 만드는 곳 

@CustomRepository(Iot_authinfo)
export class Iot_authinfoRepository extends Repository<Iot_authinfo> {
  // async existByEmail(email: string): Promise<boolean> {
  //   const existEmail = await this.exist({
  //     where: {
  //       email,
  //     },
  //   });
  //   return existEmail;
  // }
}
