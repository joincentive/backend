import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Repo } from './repo'
import { RepoService } from './repo.service'
import { BaseEntityResolver } from '../shared/graphql'

@Resolver()
export class RepoResolver extends BaseEntityResolver(Repo) {
	constructor(service: RepoService) {
		super(service);
	}

	@Mutation(() => Repo)
	createRepo(@Args('url') url: string) {
		return this.service.createRepo(url)
	}
}
