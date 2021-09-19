import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '../shared/database'
import { Pledge } from './pledge'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Issue } from '../issue/issue'
import { IssueService } from '../issue/issue.service'
import { getOSSBalance, transferOss } from '../shared/crypto'
import { User } from '../user/user'

@Injectable()
export class PledgeService extends BaseEntityService(Pledge) {
	constructor(@InjectRepository(User) private users: Repository<User>, @InjectRepository(Pledge) private pledges: Repository<Pledge>, @InjectRepository(Issue) private issues: Repository<Issue>, private issueService: IssueService) {
		super(pledges);
	}

	async createPledge(amount: string, issueURL: string, from: string) {
		const pledge = new Pledge()
		pledge.amount = amount
		let issue = await this.issues.findOne(issueURL, {
			relations: ['repo']
		})

		if (!issue) {
			issue = await this.issueService.createIssue(issueURL)
		}


		const sender = await this.users.findOneOrFail(from, {
			relations: ['pledges']
		})

		if (parseInt(amount) > parseInt(await getOSSBalance(sender))) {
			throw new Error("Insufficient $OSS funds in account.")
		}

		await transferOss(sender, issue.repo, amount)

		pledge.from = sender
		pledge.issue = issue
		await this.pledges.save(pledge)
		return pledge
	}
}
