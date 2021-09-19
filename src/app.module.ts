import { Global, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module';
import { RepoModule } from './repo/repo.module';
import { User } from './user/user'

import { PledgeModule } from './pledge/pledge.module';
import { IssueModule } from './issue/issue.module';
import { coreEntities } from './shared/database'
import { CryptoModule } from './crypto/crypto.module';
import { GithubModule } from './github/github.module';

export const AppModule = (dbURL: string): any => {
	@Global()
	@Module({
		imports: [

			TypeOrmModule.forRoot({
				type: 'postgres',
				url: dbURL,
				entities: coreEntities,
				synchronize: true,
			}),
			GraphQLModule.forRoot({
				playground: true,

				introspection: true,
				autoSchemaFile: join(process.cwd() + 'src/schema.gql'),
				sortSchema: true,
			}),
			UserModule,
			RepoModule,

			PledgeModule,
			IssueModule,
			CryptoModule,
			GithubModule,

		],
		controllers: [],
		providers: [],
	})
	abstract class BaseAppModule {}

	return BaseAppModule
}
