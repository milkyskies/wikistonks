import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable(
	"users",
	{
		id: text("id").primaryKey(),
		firebaseUid: text("firebase_uid").notNull().unique(),
		email: text("email").notNull().unique(),
		displayName: text("display_name").notNull(),
		avatarUrl: text("avatar_url"),
		cashBalance: integer("cash_balance").notNull().default(0),
		timezone: text("timezone").notNull().default("UTC"),
		lastDailyBonusAt: integer("last_daily_bonus_at", { mode: "timestamp" }),
		// Claim gate. Anchored at claim time so a user.timezone change can't advance the window.
		nextDailyBonusAt: integer("next_daily_bonus_at", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [index("idx_users_firebase_uid").on(t.firebaseUid)],
);
