import { Test, TestingModule } from '@nestjs/testing';
import { RepoResolver } from './repo.resolver';

describe('RepoResolver', () => {
  let resolver: RepoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepoResolver],
    }).compile();

    resolver = module.get<RepoResolver>(RepoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
