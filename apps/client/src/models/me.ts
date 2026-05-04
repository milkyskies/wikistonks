import type { api } from "@/services/api/client";
import { Data, Option } from "effect";
import type { InferResponseType } from "hono/client";

export type MeApiDto = InferResponseType<typeof api.me.$get, 200>;

export interface Me {
	readonly id: string;
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

export const Me = {
	make: Data.case<Me>(),

	fromApi: (dto: MeApiDto): Me =>
		Me.make({
			id: dto.id,
			email: dto.email,
			displayName: dto.displayName,
			avatarUrl: Option.fromNullable(dto.avatarUrl),
			cashBalance: dto.cashBalance,
			timezone: dto.timezone,
			lastDailyBonusAt: Option.map(
				Option.fromNullable(dto.lastDailyBonusAt),
				(value) => new Date(value),
			),
			nextDailyBonusAt: Option.map(
				Option.fromNullable(dto.nextDailyBonusAt),
				(value) => new Date(value),
			),
			createdAt: new Date(dto.createdAt),
			updatedAt: new Date(dto.updatedAt),
		}),
};
