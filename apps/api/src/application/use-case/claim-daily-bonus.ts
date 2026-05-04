import { Option } from "effect";
import type { User } from "../../domain/models/user";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { DAILY_BONUS_AMOUNT } from "../../domain/wallet";
import { DailyBonusAlreadyClaimed, UserNotFound } from "../errors";

// Beginning of "today" in UTC. The daily bonus is one-claim-per-UTC-day —
// players in any timezone get the same window.
const startOfUtcDay = (now: Date): Date =>
	new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

export type ClaimDailyBonusResult = {
	user: User;
	credited: number;
};

export async function claimDailyBonus(
	users: UserRepository,
	userId: string,
	now: Date = new Date(),
): Promise<ClaimDailyBonusResult> {
	const dayStart = startOfUtcDay(now);
	const updated = await users.claimDailyBonus({
		userId,
		dayStart,
		amount: DAILY_BONUS_AMOUNT,
	});

	if (Option.isSome(updated)) {
		return { user: updated.value, credited: DAILY_BONUS_AMOUNT };
	}

	const existing = await users.findById(userId);
	if (Option.isNone(existing)) {
		throw new UserNotFound({ userId });
	}

	throw new DailyBonusAlreadyClaimed({
		userId,
		nextClaimAt: new Date(dayStart.getTime() + 24 * 60 * 60 * 1000),
	});
}
