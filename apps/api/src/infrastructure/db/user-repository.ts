import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { Option } from "effect";
import { User } from "../../domain/models/user";
import type {
	ClaimDailyBonusInput,
	NewUser,
	UserPatch,
	UserRepository,
} from "../../domain/repositories/user-repository";
import type { Database } from "./database";
import { usersTable } from "./schema";

type UserRow = typeof usersTable.$inferSelect;

const fromRow = (row: UserRow): User =>
	User.make({
		id: row.id,
		firebaseUid: Option.fromNullable(row.firebaseUid),
		email: Option.fromNullable(row.email),
		displayName: row.displayName,
		avatarUrl: Option.fromNullable(row.avatarUrl),
		cashBalance: row.cashBalance,
		lastDailyBonusAt: Option.fromNullable(row.lastDailyBonusAt),
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	});

export const makeUserRepository = (db: Database): UserRepository => ({
	findById: async (id) => {
		const rows = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id))
			.limit(1);
		const row = rows[0];
		if (!row) return Option.none();
		return Option.some(fromRow(row));
	},

	findByFirebaseUid: async (firebaseUid) => {
		const rows = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.firebaseUid, firebaseUid))
			.limit(1);
		const row = rows[0];
		if (!row) return Option.none();
		return Option.some(fromRow(row));
	},

	findByEmail: async (email) => {
		const rows = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1);
		const row = rows[0];
		if (!row) return Option.none();
		return Option.some(fromRow(row));
	},

	create: async (input: NewUser) => {
		const now = new Date();
		const [row] = await db
			.insert(usersTable)
			.values({
				id: input.id,
				firebaseUid: Option.getOrNull(input.firebaseUid),
				email: Option.getOrNull(input.email),
				displayName: input.displayName,
				avatarUrl: Option.getOrNull(input.avatarUrl),
				cashBalance: input.cashBalance,
				createdAt: now,
				updatedAt: now,
			})
			.returning();
		return fromRow(row);
	},

	claimDailyBonus: async (input: ClaimDailyBonusInput) => {
		const now = new Date();
		const rows = await db
			.update(usersTable)
			.set({
				cashBalance: sql`${usersTable.cashBalance} + ${input.amount}`,
				lastDailyBonusAt: now,
				updatedAt: now,
			})
			.where(
				and(
					eq(usersTable.id, input.userId),
					or(
						isNull(usersTable.lastDailyBonusAt),
						lt(usersTable.lastDailyBonusAt, input.dayStart),
					),
				),
			)
			.returning();
		const row = rows[0];

		if (!row) return Option.none();

		return Option.some(fromRow(row));
	},

	update: async (id, patch: UserPatch) => {
		const updates: Partial<typeof usersTable.$inferInsert> = {
			updatedAt: new Date(),
		};
		Option.match(patch.email, {
			onNone: () => {},
			onSome: (value) => {
				updates.email = value;
			},
		});
		Option.match(patch.displayName, {
			onNone: () => {},
			onSome: (value) => {
				updates.displayName = value;
			},
		});
		Option.match(patch.avatarUrl, {
			onNone: () => {},
			onSome: (value) => {
				updates.avatarUrl = value;
			},
		});

		const [row] = await db
			.update(usersTable)
			.set(updates)
			.where(eq(usersTable.id, id))
			.returning();

		if (!row) return Option.none();
		return Option.some(fromRow(row));
	},
});
