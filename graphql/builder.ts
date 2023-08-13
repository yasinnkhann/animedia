import SchemaBuilder from '@pothos/core';
import {
	DateTimeResolver,
	BigIntResolver,
	JSONResolver,
} from 'graphql-scalars';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { prisma } from '../lib/prisma';
import { Context } from './context';

export const builder = new SchemaBuilder<{
	Context: Context;
	Scalars: {
		Date: { Input: Date; Output: Date };
		BigInt: { Input: BigInt; Output: BigInt };
		JSON: {
			Input: unknown;
			Output: unknown;
		};
	};
	PrismaTypes: PrismaTypes;
}>({
	plugins: [PrismaPlugin],
	prisma: {
		client: prisma,
	},
});

builder.addScalarType('Date', DateTimeResolver, {});
builder.addScalarType('BigInt', BigIntResolver, {});
builder.addScalarType('JSON', JSONResolver, {});
