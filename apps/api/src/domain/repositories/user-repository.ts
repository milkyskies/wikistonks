import type { Option } from "effect";
import type { User } from "../models/user";

export type NewUser = {
	id: string;
	firebaseUid: Option.Option<string>;
	email: Option.Option<string>;
	displayName: string;
	avatarUrl: Option.Option<string>;
	cashBalance: number;
};

export type UserPatch = {
	email: Option.Option<string>;
	displayName: Option.Option<string>;
	avatarUrl: Option.Option<string>;
};

export type ClaimDailyBonusInput = {
	userId: string;
	// Beginning of the UTC day the claim is being attempted for. The repo
	// only credits if `lastDailyBonusAt` is null or strictly before this.
	dayStart: Date;
	amount: number;
};

export type UserRepository = {
	findById: (id: string) => Promise<Option.Option<User>>;
	findByFirebaseUid: (firebaseUid: string) => Promise<Option.Option<User>>;
	findByEmail: (email: string) => Promise<Option.Option<User>>;
	create: (user: NewUser) => Promise<User>;
	update: (id: string, patch: UserPatch) => Promise<Option.Option<User>>;
	// Atomic claim. Returns Option.none() if the user already claimed today
	// (or doesn't exist); Option.some(user) with the credited balance otherwise.
	claimDailyBonus: (
		input: ClaimDailyBonusInput,
	) => Promise<Option.Option<User>>;
};
