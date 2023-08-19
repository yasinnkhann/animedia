import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { prisma } from '../lib/prisma';
import { Context } from './context';
import {
	DateTimeResolver,
	BigIntResolver,
	JSONResolver,
} from 'graphql-scalars';

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
	DefaultInputFieldRequiredness: true;
}>({
	plugins: [PrismaPlugin],
	prisma: {
		client: prisma,
		onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
	},
	defaultInputFieldRequiredness: true,
});

builder.addScalarType('Date', DateTimeResolver, {});
builder.addScalarType('BigInt', BigIntResolver, {});
builder.addScalarType('JSON', JSONResolver, {});

export const WatchStatusTypes = builder.enumType('WatchStatusTypes', {
	values: [
		'NOT_WATCHING',
		'WATCHING',
		'PLAN_TO_WATCH',
		'COMPLETED',
		'ON_HOLD',
		'DROPPED',
	] as const,
});

export const MovieGenreTypes = builder.enumType('MovieGenreTypes', {
	values: [
		'Action',
		'Adventure',
		'Animation',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Fantasy',
		'History',
		'Horror',
		'Music',
		'Mystery',
		'Romance',
		'Science_Fiction',
		'TV_Movie',
		'Thriller',
		'War',
		'Western',
	] as const,
});

export const TimeWindowTypes = builder.enumType('TimeWindowTypes', {
	values: ['day', 'week'],
});
