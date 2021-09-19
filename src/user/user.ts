import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Pledge } from '../pledge/pledge'

@Entity()
@ObjectType()
export class User {

	@Field(() => ID)
	@PrimaryColumn()
	username: string


	@Column('text', { array: true })
	pats: string[]

	@Field()
	@Column()
	public: string

	@Field()
	@Column()
	private: string

	@Field(() => [Pledge])
	@OneToMany(() => Pledge, p => p.from)
	pledges: Pledge[]
}
