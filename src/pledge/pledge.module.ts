import { Module } from '@nestjs/common';
import { PledgeService } from './pledge.service';
import { PledgeResolver } from './pledge.resolver';
import { importCore } from '../shared/database'
import { IssueService } from '../issue/issue.service'
import { RepoService } from '../repo/repo.service'

@Module({
  providers: [PledgeService, PledgeResolver, IssueService, RepoService],
  imports: [importCore]
})
export class PledgeModule {}
