import { Injectable } from '@nestjs/common';
import { BaseEntityService, normalizeUrl } from '../shared/database'
import { Issue } from './issue'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Repo } from '../repo/repo'
import { RepoService } from '../repo/repo.service'

@Injectable()
export class IssueService extends BaseEntityService(Issue) {
	constructor(@InjectRepository(Issue) private issues: Repository<Issue>, @InjectRepository(Repo) private repos: Repository<Repo>, private repoService: RepoService) {
		super(issues);
	}

	async createIssue(url: string) {
		const issue = new Issue()
		const normalizedU = normalizeUrl(url)
		console.log(normalizedU)
		issue.url = normalizedU
		let repo = await this.repos.findOne(normalizedU.split('/').slice(0, 3).join('/'), {
			relations: ['issues']
		})

		if (!repo) {
			repo = await this.repoService.createRepo(normalizedU.split('/').slice(0, 3).join('/'))
		}
		issue.repo = repo

		repo.issues.push(issue)
		await this.repos.save(repo)
		issue.closed = false
		issue.pledges = []
		await this.issues.save(issue)

		return issue
	}

	async getBalance(i: string) {
		const issue = await this.issues.findOneOrFail(i, {
			relations: ['pledges']
		})

		return issue.pledges.reduce((acc, val) => acc + parseInt(val.amount), 0)
	}

}
