import type { Option } from "effect";
import type { User } from "../models/user";

export type NewUser = {
	id: string;
	firebaseUid: string;
	email: string;
	displayName: string;
	avatarUrl: Option.Option<string>;
	cashBalance: number;
	timezone: string;
};

export type UserPatch = {
	displayName: Option.Option<string>;
	avatarUrl: Option.Option<string>;
	timezone: Option.Option<string>;
};

export type ClaimDailyBonusInput = {
	userId: string;
	now: Date;
	nextDailyBonusAt: Date;
	amount: number;
};

export type UserRepository = {
	findById: (id: string) => Promise<Option.Option<User>>;
	findByFirebaseUid: (firebaseUid: string) => Promise<Option.Option<User>>;
	findByEmail: (email: string) => Promise<Option.Option<User>>;
	create: (user: NewUser) => Promise<User>;
	update: (id: string, patch: UserPatch) => Promise<Option.Option<User>>;
	// Returns none if the user is gated (input.nextDailyBonusAt > stored value) or doesn't exist.
	claimDailyBonus: (
		input: ClaimDailyBonusInput,
	) => Promise<Option.Option<User>>;
};
