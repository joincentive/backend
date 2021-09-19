import { Args, Int, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../shared/graphql'
import { Issue } from './issue'
import { IssueService } from './issue.service'

@Resolver()
export class IssueResolver extends BaseEntityResolver(Issue) {
	constructor(private service: IssueService) {
		super(service);
	}

	@Mutation(() => Issue)
	createIssue(@Args('url') url: string) {
		return this.service.createIssue(url)
	}
}

@Resolver(of => Issue)
export class IssueFieldResolver {
	constructor (private service: IssueService) {}

	@ResolveField(() => Int)
	balance(@Root() root: Issue) {
		return this.service.getBalance(root.url)
	}
}
