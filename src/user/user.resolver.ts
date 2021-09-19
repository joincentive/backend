import { Args, Int, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../shared/graphql'
import { User } from './user'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { getOSSBalance } from '../shared/crypto'

@Resolver()
export class UserResolver extends BaseEntityResolver(User) {
	constructor(private service: UserService) {
		super(service);
	}

	@Mutation(() => User)
	createUser(@Args("username") username: string, @Args("pats", { type: () => [String] }) pats: string[]) {
		return this.service.createUser(username, pats)


	}
}

@Resolver(of => User)
export class UserFieldResolver {
	@ResolveField(() => Int)
	public async balance(@Root() user: User) {
		return getOSSBalance(user)
	}
}
