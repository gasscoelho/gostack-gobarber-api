import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(
    user_id: string
  ): Promise<import('../../infra/typeorm/entities/UserToken').default> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.userTokens.find(t => t.token === token);
  }
}

export default FakeUserTokensRepository;
