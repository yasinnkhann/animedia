import type PrismaTypes from '@pothos/plugin-prisma/generated';

export class RegisteredUserRes {
	constructor(
		public error: string | null,
		public createdUser: PrismaTypes['User']['Shape'] | null,
		public ok: boolean,
		public statusCode: number
	) {}
}

export class RedisRes {
	constructor(
		public error: string | null,
		public successMsg: string | null,
		public token?: string | null,
		public userId?: string | null
	) {}
}

export class AccountVerifiedRes {
	constructor(
		public error: string | null,
		public id: string | null,
		public emailVerified: Date | null
	) {}
}

export class HttpRes {
	constructor(
		public error: string | null,
		public successMsg: string | null,
		public ok: boolean,
		public statusCode: number
	) {}
}
