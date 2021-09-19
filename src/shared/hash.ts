const bcrypt = require('bcrypt')

const salt = parseInt(process.env.salt) || 3

export const hash = async (input: string) => bcrypt.hash(input, salt)

export const compareHashes = async (a: string, b: string) =>
	(await hash(a)) === (await hash(b))

export const compare = (a: string, hashed: string) => bcrypt.compare(a, hashed)
