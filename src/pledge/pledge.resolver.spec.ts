import { Test, TestingModule } from '@nestjs/testing';
import { PledgeResolver } from './pledge.resolver';

describe('PledgeResolver', () => {
  let resolver: PledgeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PledgeResolver],
    }).compile();

    resolver = module.get<PledgeResolver>(PledgeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
