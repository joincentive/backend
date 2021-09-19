import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { IssueService } from '../issue/issue.service'
import { importCore } from '../shared/database'
import { RepoService } from '../repo/repo.service'
import { UserService } from '../user/user.service'

@Module({
  controllers: [WebhookController],
  providers: [IssueService, RepoService, UserService],
  imports: [importCore]
})
export class GithubModule {}
