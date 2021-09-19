import { Module } from '@nestjs/common';
import { RepoResolver } from './repo.resolver';
import { RepoService } from './repo.service';
import { importCore } from '../shared/database'

@Module({
  providers: [RepoResolver, RepoService],
  imports: [importCore]
})
export class RepoModule {}
