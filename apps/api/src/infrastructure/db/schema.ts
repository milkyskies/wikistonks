import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const postsTable = sqliteTable(
	"posts",
	{
		id: text("id").primaryKey(),
		title: text("title").notNull(),
		body: text("body").notNull(),
		publishedAt: integer("published_at", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [index("idx_posts_created_at").on(t.createdAt)],
);

// Always present so the auth=firebase variant's user-repository compiles
// regardless of which auth strategy is selected. Idle when auth=none.
export const usersTable = sqliteTable(
	"users",
	{
		id: text("id").primaryKey(),
		firebaseUid: text("firebase_uid").unique(),
		email: text("email").unique(),
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
