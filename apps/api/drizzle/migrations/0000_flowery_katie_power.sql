CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`firebase_uid` text NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`cash_balance` integer DEFAULT 0 NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`last_daily_bonus_at` integer,
	`next_daily_bonus_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_firebase_uid_unique` ON `users` (`firebase_uid`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_firebase_uid` ON `users` (`firebase_uid`);