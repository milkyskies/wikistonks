import { Option } from "effect";
import { z } from "zod";
import type { ClaimDailyBonusResult } from "../../application/use-case/claim-daily-bonus";
import type { User } from "../../domain/models/user";

const timezoneSchema = z
	.string()
	.min(1)
	.max(64)
	.regex(/^[A-Za-z][A-Za-z0-9_+\-/]*$/, "Invalid IANA timezone");

export const createMeSchema = z.object({
	displayName: z.string().min(1).max(40),
	timezone: timezoneSchema,
});

export type CreateMeDto = z.infer<typeof createMeSchema>;

export type MeDto = {
	id: string;
	email: string;
	displayName: string;
	avatarUrl: string | null;
	cashBalance: number;
	timezone: string;
	lastDailyBonusAt: string | null;
	nextDailyBonusAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export const toMeDto = (user: User): MeDto => ({
	id: user.id,
	email: user.email,
	displayName: user.displayName,
	avatarUrl: Option.getOrNull(user.avatarUrl),
	cashBalance: user.cashBalance,
	timezone: user.timezone,
	lastDailyBonusAt: Option.match(user.lastDailyBonusAt, {
		onNone: () => null,
		onSome: (date) => date.toISOString(),
	}),
	nextDailyBonusAt: Option.match(user.nextDailyBonusAt, {
		onNone: () => null,
		onSome: (date) => date.toISOString(),
	}),
	createdAt: user.createdAt.toISOString(),
	updatedAt: user.updatedAt.toISOString(),
});

export type DailyBonusDto = {
	credited: number;
	me: MeDto;
};

export const toDailyBonusDto = (
	result: ClaimDailyBonusResult,
): DailyBonusDto => ({
	credited: result.credited,
	me: toMeDto(result.user),
});
