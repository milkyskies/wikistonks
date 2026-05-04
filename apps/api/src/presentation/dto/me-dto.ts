import { Option } from "effect";
import { z } from "zod";
import type { ClaimDailyBonusResult } from "../../application/use-case/claim-daily-bonus";
import type { User } from "../../domain/models/user";

export const createMeSchema = z.object({
	displayName: z.string().min(1).max(40),
});

export type CreateMeDto = z.infer<typeof createMeSchema>;

export type MeDto = {
	id: string;
	email: string | null;
	displayName: string;
	avatarUrl: string | null;
	cashBalance: number;
	lastDailyBonusAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export const toMeDto = (user: User): MeDto => ({
	id: user.id,
	email: Option.getOrNull(user.email),
	displayName: user.displayName,
	avatarUrl: Option.getOrNull(user.avatarUrl),
	cashBalance: user.cashBalance,
	lastDailyBonusAt: Option.match(user.lastDailyBonusAt, {
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
