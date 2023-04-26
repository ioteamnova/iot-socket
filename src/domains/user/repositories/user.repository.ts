import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

//쿼리문 만드는 곳 

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async existByEmail(email: string): Promise<boolean> {
    const existEmail = await this.exist({
      where: {
        email,
      },
    });
    return existEmail;
  }
}
