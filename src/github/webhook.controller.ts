import { Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { IssueService } from '../issue/issue.service'
import { extractNum } from '../shared/types'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Issue } from '../issue/issue'
import { normalizeUrl } from '../shared/database'
import fetch from 'isomorphic-unfetch'
import { getOSSBalance, transferOss } from '../shared/crypto'
import { Repo } from '../repo/repo'
import { User } from '../user/user'
import { UserService } from '../user/user.service'

@Controller('webhooks')
export class WebhookController {
	constructor(private issueService: IssueService,@InjectRepository(User) private users: Repository<User>, @InjectRepository(Issue) private issues: Repository<Issue>, @InjectRepository(Repo) private repos: Repository<Repo>, private userService: UserService) {
	}
	@Post('github')
	async github(@Req() request: Request): Promise<string> {
		console.log(request.body)
		const { body: { action, ...body } } = request
		if (action === 'closed') {
			if (body.pull_request) {
				const closesIssues: number[] = body.pull_request.body.match(/[a-zA-Z]+\s#\d/g).map(extractNum)
				const issues = await this.issues.findByIds(closesIssues.map((num)=> normalizeUrl(`${body.repository.html_url}/issues/${num}`)), {
					relations: ['pledges']
				})
				const repo = await this.repos.findOneOrFail(normalizeUrl(body.repository.html_url))
				const commits = await (await fetch(body.pull_request.commits_url)).json()
				const authors = commits.filter(c => c.author).map(z => z.author.login)
				await Promise.all(issues.map(async (issue) => {
					issue.closed = true
					issue.prReference = body.number.toString()
					issue.commitReference = body.pull_request.merge_commit_sha
					await this.issues.save(issue)
				}))

				const pledges = await Promise.all(issues.map(e => this.issueService.getBalance(e.url)))
				const total = pledges.reduce((a, b) => a + b, 0)
				const each = Math.floor(total/authors.length)
				await ([...new Set(authors)].forEach(async (z) => {
					const u = await this.users.findOneOrFail(z)
					await transferOss(repo, u, each.toString())
				}))


				return 'done'
			}

			else if (body.issue) {
				const issue = await this.issues.findOneOrFail(normalizeUrl(`${body.issue.html_url}`), { relations: ['pledges'] })
				if (issue.closed) {
					return 'done'
				}
			console.log(issue)

				const repo = await this.repos.findOneOrFail(normalizeUrl(body.repository.html_url))

				const issueGH = await (await fetch(body.issue.url)).json()

				const total = await this.issueService.getBalance(issue.url)

				const usearchers: string[] = issueGH.assignees.map(z => z.login)
				const users = await Promise.all(usearchers.map(async (username) => {
					let user = await this.users.findOne(username)

					if (!user) {
						user = await this.userService.createUser(username, [])
					}

				return user
				}))

				console.log(users)

				const each = Math.floor(total/users.length)
				await (users.forEach(async (z) => {
					const u = await this.users.findOneOrFail(z)
					await transferOss(repo, u, each.toString())
				}))

				return 'done'
			}
		}

		if (action === 'opened' && body.issue) {
			await this.issueService.createIssue(body.issue.html_url)
		}
		return 'hello'
	}
}
