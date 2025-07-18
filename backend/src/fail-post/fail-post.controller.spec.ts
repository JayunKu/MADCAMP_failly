import { Test, TestingModule } from '@nestjs/testing';
import { FailPostController } from './fail-post.controller';

describe('FailPostController', () => {
  let controller: FailPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FailPostController],
    }).compile();

    controller = module.get<FailPostController>(FailPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
