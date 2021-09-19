import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueFieldResolver, IssueResolver } from './issue.resolver'
import { importCore } from '../shared/database'
import { RepoService } from '../repo/repo.service'

@Module({
  providers: [IssueService, IssueResolver, RepoService, IssueFieldResolver],
  imports: [importCore]
})
export class IssueModule {}
