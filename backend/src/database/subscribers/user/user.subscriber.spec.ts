import { Test, TestingModule } from '@nestjs/testing';
import { UserSubscriber } from './user.subscriber';

describe('UserSubscriber', () => {
  let controller: UserSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSubscriber],
    }).compile();

    controller = module.get<UserSubscriber>(UserSubscriber);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
