import { Test, TestingModule } from '@nestjs/testing';
import { FailpostsService } from './failposts.service';

describe('FailpostsService', () => {
  let service: FailpostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FailpostsService],
    }).compile();

    service = module.get<FailpostsService>(FailpostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
