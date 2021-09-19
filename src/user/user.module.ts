import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserFieldResolver, UserResolver } from './user.resolver'
import { importCore } from '../shared/database'

@Module({
  providers: [UserService, UserResolver, UserFieldResolver],
  imports: [ importCore]
})
export class UserModule {}
