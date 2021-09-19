import { Injectable } from '@nestjs/common';
import { BaseEntityService, normalizeUrl } from '../shared/database'
import { Repo } from './repo'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { issuingKeys, oss, server, stellar } from '../shared/crypto'
import { User } from '../user/user'
import fetch from 'isomorphic-unfetch'

@Injectable()
export class RepoService extends BaseEntityService(Repo) {
	constructor(@InjectRepository(Repo) private repos: Repository<Repo>) {
		super(repos);
	}

	async createRepo(url: string) {
		const repo = new Repo()
		repo.url = normalizeUrl(url)
		repo.issues = []
		const receivingKeys = stellar.Keypair.random()
		console.log(receivingKeys)
		console.log(receivingKeys.publicKey())
		console.log(receivingKeys.secret())
		repo.private = receivingKeys.secret()
		repo.public = receivingKeys.publicKey()
		await this.repos.save(repo)
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

		return repo
	}
}
