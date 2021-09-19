import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Pledge } from '../pledge/pledge'
import { Repo } from '../repo/repo'

@Entity()
@ObjectType()
export class Issue {
	@Field(() => Repo)
	@ManyToOne(() => Repo, r => r.issues)
	repo: Repo
	@Field(() => [Pledge])
	@OneToMany(() => Pledge, p => p.issue)
	pledges: Pledge[]

	@Field(() => ID)
	@PrimaryColumn()
	url: string
	@Field()
	@Column()
	closed: boolean
	@Field({ nullable: true })
	@Column({ nullable: true })
	prReference?: string
	@Field({ nullable: true })
	@Column({ nullable: true })
	commitReference?: string
}
