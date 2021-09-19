import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user'
import { Issue } from '../issue/issue'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Pledge {
	@PrimaryGeneratedColumn()
	@Field(() => ID)
	id: string

	@Field(() => User)
	@ManyToOne(() => User, u => u.pledges)
	from: User

	@Field()
	@Column()
	amount: string

	@Field(() => Issue)
	@ManyToOne(() => Issue, i => i.pledges)
	issue: Issue
}
