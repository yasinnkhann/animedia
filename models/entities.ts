import type PrismaTypes from '@pothos/plugin-prisma/generated';

export class RegisteredUserRes {
	constructor(
		public error: string,
		public createdUser: PrismaTypes['User']['Shape'],
		public ok: boolean,
		public statusCode: number
	) {}
}

export class RedisRes {
	constructor(
		public error: string,
		public successMsg: string,
		public token: string,
		public userId: string
	) {}
}

export class AccountVerifiedRes {
	constructor(
		public error: string,
		public id: string,
		public emailVerified: Date
	) {}
}

export class NodeRes {
	constructor(
		public error: string,
		public successMsg: string,
		public ok: boolean,
		public statusCode: number
	) {}
}
