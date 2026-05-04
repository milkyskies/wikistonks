import { Data, type Option } from "effect";

export interface User {
	readonly id: string;
	readonly firebaseUid: string;
	readonly email: string;
	readonly displayName: string;
	readonly avatarUrl: Option.Option<string>;
	readonly cashBalance: number;
	readonly timezone: string;
	readonly lastDailyBonusAt: Option.Option<Date>;
	readonly nextDailyBonusAt: Option.Option<Date>;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export const User = {
	make: Data.case<User>(),
};
