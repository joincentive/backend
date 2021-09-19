import { stellar, server } from './src/shared/crypto'
import * as os from 'os'

const issuing = stellar.Keypair.random()
const receiverKeys = stellar.Keypair.random()
console.log(issuing.publicKey())
console.log(issuing.secret())
console.log(receiverKeys.publicKey())
console.log(receiverKeys.secret())

const oss = new stellar.Asset("OSS", issuing.publicKey())

// server.loadAccount(issuing.publicKey())
// 	.then((receiver) => {
// 		var transaction = new stellar.TransactionBuilder(receiver, {
// 			fee:  "1000",
// 			networkPassphrase: stellar.Networks.TESTNET,
//
// 		}).addOperation(stellar.Operation.changeTrust({
// 			asset: oss,
// 			limit: "10000"
// 		})).setTimeout(10).build()
// 		transaction.sign(receiverKeys)
// 		return server.submitTransaction(transaction)
// 	}).then(console.log).catch(z => console.log(z))

server.loadAccount(receiverKeys.publicKey()).then(r => {
	const transaction = new stellar.TransactionBuilder(r, {
		fee: "100",
		networkPassphrase: stellar.Networks.TESTNET
	}).addOperation(stellar.Operation.createAccount({
		destination: r.accountId(),
		startingBalance: "10000",
	})).setTimeout(100).build()
	transaction.sign(receiverKeys)
	return server.submitTransaction(transaction)
}).then(console.log).catch(console.log)
