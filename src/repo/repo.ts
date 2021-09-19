import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Issue } from '../issue/issue'

@ObjectType()
@Entity()
export class Repo {
	@PrimaryColumn()
	@Field(() => ID)
	url: string
	@Field(() => [Issue])
	@OneToMany(() => Issue, i => i.repo)
	issues: Issue[]
	@Field()
	@Column()
	public: string

	@Field()
	@Column()
	private: string

}
