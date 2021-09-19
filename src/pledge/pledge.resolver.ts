import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { BaseEntityResolver } from '../shared/graphql'
import { Pledge } from './pledge'
import { PledgeService } from './pledge.service'

@Resolver()
export class PledgeResolver extends BaseEntityResolver(Pledge) {
	constructor(private service: PledgeService) {
		super(service);
	}

	@Mutation(() => Pledge)
	createPledge(@Args('amount') amount: string, @Args('issue') issue: string, @Args('from') from: string) {
		return this.service.createPledge(amount, issue, from)
	}
}
