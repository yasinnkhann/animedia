import type PrismaTypes from '@pothos/plugin-prisma/generated';

export class RegisteredUserRes {
	constructor(
		public error: string,
		public createdUser: PrismaTypes['User']['Shape'],
		public ok: boolean,
		public statusCode: number
	) {}
}
