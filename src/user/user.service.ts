import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '../shared/database'
import { User } from './user'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { issuingKeys, oss, server, stellar } from '../shared/crypto'
import fetch from 'isomorphic-unfetch'

@Injectable()
export class UserService extends BaseEntityService(User) {
	constructor(@InjectRepository(User) private users: Repository<User>) {
		super(users);
	}

	public async createUser(username: string,pats: string[]) {
		const receivingKeys = stellar.Keypair.random()
		const user = new User()
		user.username = username

		user.private = receivingKeys.secret()
		user.public = receivingKeys.publicKey()
		user.pats = pats
		console.log(receivingKeys)
		console.log(receivingKeys.publicKey())
		console.log(receivingKeys.secret())
		await this.users.save(user)
		await fetch(
				`https://friendbot.stellar.org?addr=${encodeURIComponent(
					receivingKeys.publicKey(),
				)}`,
			);
			// const responseJSON = await response.json();
			// console.log("SUCCESS! You have a new account :)\n", responseJSON);
		await server
			.loadAccount(receivingKeys.publicKey())
			.then(async  (receiver) => {
				var transaction = new stellar.TransactionBuilder(receiver, {
					fee: await server.fetchBaseFee() as any,
					networkPassphrase: stellar.Networks.TESTNET,
				})
					// The `changeTrust` operation creates (or alters) a trustline
					// The `limit` parameter below is optional
					.addOperation(
						stellar.Operation.changeTrust({
							asset: oss,
							// limit: "1000",
						}),
					)
					// setTimeout is required for a transaction
					.setTimeout(100)
					.build();
				transaction.sign(receivingKeys);
				return server.submitTransaction(transaction);
			})
			.then(console.log)

			// Second, the issuing account actually sends a payment using the asset
			.then(function () {
				return server.loadAccount(issuingKeys.publicKey());
			})
			.then(async  (issuer) => {
				var transaction = new stellar.TransactionBuilder(issuer, {
					fee: await server.fetchBaseFee() as any,
					networkPassphrase: stellar.Networks.TESTNET,
				})
					.addOperation(
						stellar.Operation.payment({
							destination: receivingKeys.publicKey(),
							asset: oss,
							amount: "10",
						}),
					)
					// setTimeout is required for a transaction
					.setTimeout(100)
					.build();
				transaction.sign(issuingKeys);
				return server.submitTransaction(transaction);
			})
			.then(console.log)
			.catch(function (error) {
				console.error("Error!", error);
			});

		return user
	}
}
