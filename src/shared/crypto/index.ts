import * as api from 'stellar-sdk'

export const server = new api.Server("https://horizon-testnet.stellar.org")
export const stellar = api;
export const issuingKeys = api.Keypair.fromSecret(
	"SBPTHMYIDZRJDUETOCACJ4I7IEDXUQSZBZZCT3RRL4HRQIMHLSO6B5GO",
);
export const oss = new api.Asset("OSS", issuingKeys.publicKey())
interface OSSCompat {
	public: string
	private: string
}
export const transferOss = async (from: OSSCompat, to: OSSCompat, amount: string) => {
	const sender = api.Keypair.fromSecret(from.private)
	const receiver = api.Keypair.fromSecret(to.private)
	const sending = await server.loadAccount(from.public)
	console.log(sending.balances)
	const balance = sending.balances.filter(p => (p as any).asset_code === 'OSS')[0].balance
	if (parseInt(balance) < parseInt(amount)) {
		throw new Error('not enough funds.')
	}
	const transaction = new api.TransactionBuilder(sending, {
		fee: await server.fetchBaseFee() as any,
		networkPassphrase: api.Networks.TESTNET
	}).addOperation(api.Operation.payment({
		destination: receiver.publicKey(),
		asset: oss,
		amount: amount,
	})).setTimeout(100).build()
	await transaction.sign(sender)
	return server.submitTransaction(transaction)
}

export const getOSSBalance = async (from: OSSCompat) => {
	const account = await server.loadAccount(from.public)
	return account.balances.filter(p => (p as any).asset_code = "OSS")[0].balance
}
